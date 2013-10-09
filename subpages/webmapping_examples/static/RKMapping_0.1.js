function mapOverlay(map_){
	this.map=map_;
	this.overlaySVG = d3.select(this.map.getPanes().overlayPane).append("svg");
	this.overlay=this.overlaySVG.append("g").attr("class", "leaflet-zoom-hide")
	var path_geo = d3.geo.path().projection(project);

	this.resetView=resetView;
	function resetView(bounds_map_){
		var bottomLeft = project(bounds_map_[0]),
		    topRight = project(bounds_map_[1]);
		this.overlaySVG.attr("width", topRight[0] - bottomLeft[0])
		    	.attr("height", bottomLeft[1] - topRight[1])
		    	.style("margin-left", bottomLeft[0] + "px")
		    	.style("margin-top", topRight[1] + "px");
		this.overlay.attr("transform", "translate(" + -bottomLeft[0] + "," + -topRight[1] + ")");
		this.features.attr("d",function(d){
				var typ = d.type;
				//console.log(d)
				if (d.type==='ArcString')typ='LineString';
				var new_path = path_geo({type: typ, coordinates: d.coordinates})			
				return new_path;
		})
	}
	this.removeAll=removeAll;
	function removeAll(){this.overlay.selectAll("path").remove();}

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
	
	function project(x) {
		var point = this.map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
		return [point.x, point.y];
	}
}


