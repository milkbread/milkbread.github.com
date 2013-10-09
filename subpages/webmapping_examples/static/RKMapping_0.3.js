//adding an overlay to an existing leaflet map object
function mapOverlay(map_){
	this.map=map_;
	this.overlaySVG = d3.select(this.map.getPanes().overlayPane).append("svg");
	this.overlay=this.overlaySVG.append("g").attr("class", "leaflet-zoom-hide")
	var path_geo = d3.geo.path().projection(project);
	//necessary for zooming the map...corresponded to: map.on("viewreset", reset);
	this.resetView=resetView;
	function resetView(bounds_map_){
		var bottomLeft = project(bounds_map_[0]),
		    topRight = project(bounds_map_[1]);
		this.overlaySVG.attr("width", topRight[0] - bottomLeft[0])
		    	.attr("height", bottomLeft[1] - topRight[1])
		    	.style("margin-left", bottomLeft[0] + "px")
		    	.style("margin-top", topRight[1] + "px");
		this.overlay.attr("transform", "translate(" + -bottomLeft[0] + "," + -topRight[1] + ")");
//		this.showAll();
	}
	//show us all geometries that where added
	this.showAll=showAll;
	function showAll(){
		this.features.attr("d",function(d){
			var coords = d.coordinates, typ = d.type;
			if (d.type==='Feature'){coords = d.geometry.coordinates; typ=d.geometry.type;}		
		//console.log(d)
			if (d.type==='ArcString')typ='LineString';
			var new_path = path_geo({type: typ, coordinates: coords})			
			return new_path;
		})
	}
	//show us all geometries...filteres
	this.showAllFiltered=showAllFiltered;
	function showAllFiltered(maxVal){
		var counter = [0,0,0]; //[features, points_all, points_filteres]
		this.features.attr("d",function(d){
			var coords = d.coordinates, typ = d.type;
			if (d.type==='Feature'){coords = d.geometry.coordinates; typ=d.geometry.type;}		
		//console.log(d)
			if (d.type==='ArcString')typ='LineString';
			var new_path = path_geo({type: typ, coordinates: filtering(typ, coords)})
			counter[0]++;			
			return new_path;
		})
		return counter;
		function filtering(type, coords){
			//console.log("test")
			if (type == 'Polygon'){	coords = coords.map(mapLineString)			}
			else if (type == 'MultiPolygon'){coords = coords.map(mapPolygon)		}
			else if (type == 'MultiLineString'){coords = d.coords.map(mapLineString)	}
			return coords;
		}
		function mapPolygon(polygon){
			return polygon.map(mapLineString);
		}
		function mapLineString(linestring){
			return linestring.filter(filterPoints);
		}
		function filterPoints(point){
			counter[1]++;			
			if (point.length<3 || point[2]>maxVal){ counter[2]++;			
			return point; }
		}

	}
	//clean the overlay container
	this.removeAll=removeAll;
	function removeAll(){this.overlay.selectAll("path").remove();}
	//add some geometries to the overlay
	this.addGeometries=addGeometries;
	function addGeometries(geoms_,path_ext){
		if(path_ext===undefined)path_ext="path"
		if (geoms_.length!==undefined){
			this.features = this.overlay.selectAll(path_ext)
				.data(geoms_)
				.enter()
				.append("path");
		}else {
			this.features = this.overlay
				.append("path")
				.datum(geoms_);
		}
	}
	//projection to re-project overlay on the existing leaflet map
	function project(x) {
		var point = this.map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
		return [point.x, point.y];
	}
}
//end of map overlay
//*****************
//get the arc-geometries
function getArcs(topology, geometries, simplify_){
	var col_arcs_ = {};	
	geometries.forEach(function(d){
		if(d.type==='Polygon'){	readPolygon({arcs:d.arcs}); 	}
		else if(d.type==='MultiPolygon'){ d.arcs.map(function(e,i){return readPolygon({arcs:d.arcs[i]})}); }
	})
	return col_arcs_;
	function readPolygon(data){
		//loop the linestrings of the polygon
		for (var i=0;i<data.arcs.length;i++){
			//get the related 'LineString's by splitting at the start/end points (length === 4) 
			for (var j=0; j<data.arcs[i].length;j++){
				var arc_id = data.arcs[i][j];
				var sign = 1; 
				if(arc_id<0){arc_id= (arc_id*(-1))-1; sign = -1;}
				var arcs_cache = topojson.feature(topology, {type: 'LineString', arcs:[arc_id]});
				arcs_cache.coordinates = arcs_cache.geometry.coordinates;
				//...simplify arc-geometries directly when specified
				if (simplify_ !== undefined){
					simplifyProcesses(arcs_cache, simplify_[0], simplify_[1])
				}
				arcs_cache.sign = sign;
				col_arcs_[arc_id]=arcs_cache;
			}
		}
	}
}
//enf of get the arc-geometries
//*****************
//build geometries from arc-geometries
function getGeometries(geometries, col_arcs_){
	var polygons = [];
	geometries.forEach(function(d){
		if(d.type==='Polygon'){
			var a = readPolygon2({arcs:d.arcs}); 
			polygons.push({type:'Polygon', coordinates: a, properties: d.properties})
		}
		else if(d.type==='MultiPolygon'){
			var a = d.arcs.map(function(e,i){return readPolygon2({arcs:d.arcs[i]})}); 
			polygons.push({type:'MultiPolygon', coordinates: a, properties: d.properties})
		}
		
	})
	return polygons;
	function readPolygon2(data){
		var interPolys = [];
		//loop the linestrings of the polygon
		for (var i=0;i<data.arcs.length;i++){
			//get the related 'LineString's by splitting at the start/end points (length === 4) 
			var poly_cache = [];
			for (var j=0; j<data.arcs[i].length;j++){
				var arc_id = data.arcs[i][j];
				var sign = 1; 
				if(arc_id<0){arc_id= (arc_id*(-1))-1; sign = -1;}
				var arcs_cache2 = col_arcs_[arc_id].coordinates.slice();//--> das war der knackpunkt!!!!!!!!!!http://www.d-mueller.de/blog/javascript-arrays-kopieren/
				if(sign===-1){arcs_cache2.reverse();}
				//remove the last (it is redundant!!!) ...do only, when it is not the last LineString
				if(j!==data.arcs[i].length-1){arcs_cache2.pop();}
				//re-build the polygon to test this implementation
				for (var x = 0;x<arcs_cache2.length;x++) poly_cache.push(arcs_cache2[x])				
			}
			interPolys.push(poly_cache);					
		}
		return interPolys;
	}
}
//end of build
//************
//simplify and filter arc-geometries
function simplifyArcs(col_arcs_, simplify_, max_val){
	for(arcs in col_arcs_){
		simplifyProcesses(col_arcs_[arcs], simplify_, max_val)
	}
	return col_arcs_;
}
function simplifyProcesses(arc, simplify_, max_val){
	arc.type='LineString';
	simplify_(arc)
	var simple_arc = arc.coordinates.filter(call_filterLine)
	arc.coordinates=simple_arc;

	function call_filterLine(data){
		return filterLine(data, max_val)
	}
}

function filterLine(data, max_val){
	if(data.length===2 ||data[2]===0 || data[2]>max_val) 
	//console.log(data)
	return data
}
//end of simplify arc-geometries
//************
function filterSimplifiedArcs(col_arcs_, max_val){
	for(arcs in col_arcs_){
		var arc = col_arcs_[arcs];
		var simple_arc = arc.coordinates.filter(call_filterLine)
		arc.coordinates=simple_arc;
	}
	return col_arcs_;
	function call_filterLine(data){
		return filterLine(data, max_val)
	}
}

//get the triangle values of the generalized arc-geometries
function getTriangleSizes(col_arcs_){
	var max = 0, min = 100000000;//,allTriangleSizes = [];
	for (arcs in col_arcs_){
		col_arcs_[arcs].geometry.coordinates.forEach(function(d){
			if(d.length >= 3 ){
				//allTriangleSizes.push(d[2])
				if (d[2]<min)min=d[2];
				if(d[2]>max)max=d[2];
			}		
		})
	}
	return [min, max]
}


