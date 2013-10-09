function changedCat(value){
	category = value;
	if(value==='munics'){geoms=munics.geometries;scale = 50; trans =[0.75,0.25];}
	else if(value==='units'){geoms=units.geometries;scale = 25; trans =[2,0.5];}
	else if(value==='states'){geoms=states.geometries;scale = 15; trans =[5,0];}
	trans_par_ed[0].text("Scale: "+scale);
	trans_par_ed[1].text("Transition: X="+trans[0]+" - Y="+trans[1]);
	doVisualisation();
}
function changedAP(value,name){
//	console.log(name, value);
	if(name==='min_ewz'){min_attribs[2]=value;} 
	else if(name==='min_area'){min_attribs[0]=value;}
	else if(name==='min_length'){min_attribs[1]=value;}
	else if(name==='min')slice_params[0]=value; 
	else if(name==='max')slice_params[1]=value; 
	doVisualisation();}
function changedRB(value){attribute=value; doVisualisation();}function sortPolygons(data, attrib){
	//push all values to an array
	if(attrib==='EWZ')var new_array = data.map(function(d){return d.properties.EWZ});
	else if(attrib==='Area')var new_array = data.map(function(d){return d.properties.SHAPE_AREA});
	else if(attrib==='Length')var new_array = data.map(function(d){return d.properties.LENGTH});
	//sort the new array --> Help:http://www.javascriptkit.com/javatutors/arraysort.shtml
	new_array=new_array.sort(function(a,b){return b - a});
	//find the related attribute in the data an push it to a new data-array
	var new_data = new_array.map(function(value){
		var cache;
		data.forEach(function(d){
			if(attrib==='EWZ'){if(value===d.properties.EWZ)cache=d}
			else if(attrib==='Area'){if(value===d.properties.SHAPE_AREA)cache=d}
			else if(attrib==='Length'){if(value===d.properties.LENGTH)cache=d}
		})
		//return the found dataset to the new data-array
		return cache;
	})
	//return the sorted data-array
	return new_data;
}

function doVisualisation(){
//!!!Achtung hier fehlt noch eine Fehlerabfangung...wenn 0 geometrien vorhanden sind!!!
	sliced_geoms = geoms.slice(slice_params[0],slice_params[1])
	sliced_geoms = sliced_geoms.filter(function(d){return d.properties.EWZ>min_attribs[2] && d.properties.SHAPE_AREA>(min_attribs[0]*1000000) && d.properties.LENGTH>(min_attribs[1]*1000);});
	slice_cache1.text("Total number of municipalities = "+geoms.length);
	slice_cache2.text("...after filtering = "+sliced_geoms.length+" geometries")
	//sort Polygons in relation to a chosen attribute
	sliced_geoms = sortPolygons(sliced_geoms,attribute);
	//add the sliced and sorted polygon name to the unit selector
	var sorted_names = sliced_geoms.map(function(d){return d.properties.GEN})
	sorted_names=sorted_names.sort();
	unit_selector.selectAll("option").remove();
	unit_selector.selectAll("option").data(sorted_names).enter().append("option").attr("value",function(d){return d}).text(function(d,i){return d});
	//...add the whole geometry to the map
	doOverlay();
	reset();
	map.on("viewreset", reset);
	//fill the legend with content
	slice_par4.selectAll("rect").data(class_vals).enter().append("rect").attr("class",function(d,i){return "cat"+i})
			.attr("x",140).attr("y",function(d,i){return (i*15)+15;})
			.attr("height",10).attr("width",60);
	slice_par4.selectAll("text").remove();
	slice_par4.selectAll("text").data(class_vals).enter().append("text")
			.attr("x",10)
			.attr("y",function(d,i){return (i*15)+25;})
			.text(function(d){if(d!==0)return "Pop. < "+d; else return "Population > "})
			.attr("font-size", "14px")
			.attr("fill", "white");
	//console.log(sliced_geoms[0].properties)
	//add one row for each element in the data_array ('div - class:td')
	//...and...
	//one svg-element per row
	table.selectAll("div").remove();
	var svg_containers = table.selectAll("div").data(sliced_geoms).enter().append("div").attr("class","td").attr("id",function(d,i){return d.properties.GEN}).append("svg").attr("height",h_svg).attr("width",w_svg).attr("id",function(d,i){return d.properties.GEN});
	//add one circle to each svg
//	svg_containers.append("circle").attr("cx", info_pos[0]+3).attr("cy", info_pos[1]).attr("r", "7").attr("class", "circles");
	//add the rank to each svg
	svg_containers.append("text").text(function(d,i){return "Rank: "+(i+1)}).attr("x", info_pos[0]-1).attr("y", info_pos[1]+2).attr("class", "attrib");
	//add the Name of the state to each svg
	svg_containers.append("text").text(function(d){return d.properties.GEN}).attr("x", info_pos[0]).attr("y", info_pos[1]+20).attr("class","attrib");
	//add the chosen attribute value of state to each svg
	svg_containers.append("text")
		.text(function(d){
			if(attribute==='EWZ')return "EWZ: "+ d.properties.EWZ; 
			else if(attribute==='Area')return "Area: "+ (d.properties.SHAPE_AREA/1000000).toFixed(2)+" km²"
			else if(attribute==='Length')return "Length: "+ (d.properties.LENGTH/1000).toFixed(2)+" km"})
		.attr("x", info_pos[0]).attr("y", info_pos[1]+30).attr("class","attrib");
	//add one group per svg respectively div...makes it easier to handle the scaling	
	var groups = svg_containers.append("g").attr("transform","scale("+scale+")");
	//add the state to the group...flip horizontal geometry by scale(1,-1)
	groups.append("path").attr("id", "sorted").attr("class", getColorCodedClass).style("stroke-width",1/scale + "px").attr("transform","translate("+trans[0]+","+trans[1]+") scale(1,-1)")
		.on("mousedown",
			function(d){
				var geom;
				geoms.forEach(function(e){if(d.properties.GEN===e.properties.GEN)geom=e})
//				console.log(geom.properties.GEN);
			var 	local_bounds = d3.geo.bounds(d),
				center = new L.LatLng(local_bounds[0][1]+((local_bounds[1][1]-local_bounds[0][1])/2),local_bounds[0][0]+((local_bounds[1][0]-local_bounds[0][0])/2)),
				southWest = new L.LatLng(local_bounds[0][1], local_bounds[0][0]),
			    	northEast = new L.LatLng(local_bounds[1][1], local_bounds[1][0]);
			var    	local_bounds = new L.LatLngBounds(southWest, northEast);
				map.setView( center, map.getBoundsZoom( local_bounds));
		})		
		.attr("d",function(d){
			//reset the global variable 'bounds' as it used within the 'normalize_projection'
			bounds=d3.geo.bounds(d);
			var new_path = path({type: d.type, coordinates: d.coordinates})
			return new_path;
	});
}

//this projection normalizes the geometry...to fit into the div-svg
function normalize_projection(x) {return [x[0]-bounds[1][0],x[1]-bounds[1][1]];}
//this function sets the view of 'div#view' to the selected unit
function changedUS(value){
	window.location.hash=value; highlightSelectedDiv(value);
	d3.select("svg.upper").attr("height","0")
}
function highlightSelectedDiv(val){
	if (clicked_cache!==undefined)clicked_cache.attr("class","td");
	clicked_cache = d3.selectAll("div#"+val+".td").attr("class","td3");
}
//this function sets the view of 'div#view' to the searched unit...when it exists
function searched(value){
	var found = false, where = -1;
	sliced_geoms.forEach(function(d,i){if(d.properties.GEN===value){found=true;where=i+1}})
	if (found===true){
		search_unit[1].text("'"+value+"' has been found at position "+where);
		window.location.hash=value;
		highlightSelectedDiv(value);
	}
	else search_unit[1].text("Sorry! - '"+value+"' does not exist!");}
//this function resets the initial value of the search field...when clicked into it
function resetField(){search_unit[0].attr("style","color: #000").attr("value","")}
//this function adds and defines the additional parameters for the pre-filtering
function setInfoText(){
	//add information on the transformation parameter
	var trans_par = d3.select("#text.upper").select('div.table').select('div.tr').append("div").attr("class","td2")
	trans_par.append("h").text("Transition parameter");
	trans_par.append("br");
	trans_par.append("advice").text("Shows the transformation parameter.");
	trans_par.append("br");
	trans_par.append("br");
	trans_par_ed[0] = trans_par.append("params");
	trans_par.append("br");
	trans_par_ed[1] = trans_par.append("params");
	trans_par.append("br");
	trans_par.append("br");
	//add information on slice parameter
	//d3.select("#text.upper").append("h").text("Filtering");
	var slice_table = d3.select("#text.upper").append("div").attr("class","table").append("div").attr("class","tr");
	slice_par = slice_table.append("div").attr("class","td2");
	slice_par.append("h").text("Slice")
	slice_par.append("br");
	slice_par.append("advice").text("Slice parameter (filter index)");
	slice_par.append("br");
	slice_par.append("input").attr("type","text").attr("size","5").attr("name","min").attr("value",slice_params[0]).attr("onChange","changedAP(value,name)");
	slice_par.append("else").text(" - ");
	slice_par.append("input").attr("type","text").attr("size","5").attr("name","max").attr("value",slice_params[1]).attr("onChange","changedAP(value,name)");
	slice_par.append("br")
	var slice_par2 = slice_table.append("div").attr("class","td2");
	//add information on pre-filtering
	slice_par2.append("h").text("Filter")
	slice_par2.append("br");
	slice_par2.append("advice").text("Minimum values of attributes");
	slice_par2.append("br");
	slice_par2.append("attribs").text("Area: ");
	slice_par2.append("input").attr("type","text").attr("size","10").attr("name","min_area").attr("value",min_attribs[0]).attr("onChange","changedAP(value,name)");
	slice_par2.append("attribs").text(" km²");
	slice_par2.append("br");
	slice_par2.append("attribs").text("Length: ");
	slice_par2.append("input").attr("type","text").attr("size","5").attr("name","min_length").attr("value",min_attribs[1]).attr("onChange","changedAP(value,name)");
	slice_par2.append("attribs").text(" km");
	slice_par2.append("br");
	slice_par2.append("attribs").text("EWZ: ");
	slice_par2.append("input").attr("type","text").attr("size","5").attr("name","min_ewz").attr("value",min_attribs[2]).attr("onChange","changedAP(value,name)");
	//add search and selection
	var slice_par3 = slice_table.append("div").attr("class","td2");
	slice_par3.append("h").text("Search");
	slice_par3.append("br");
	slice_par3.append("advice").text("Select a unit (ASC sorted)");
	unit_selector = slice_par3.append("form").attr("name","unit_form").append("select").attr("name","unit_sel").attr("onChange","changedUS(value)").attr("size","3");
	slice_par3.append("br");
	slice_par3.append("advice").text("Search a unit");
	slice_par3.append("br");
	search_unit[0] = slice_par3.append("input").attr("type","text").attr("size","15").attr("name","search_unit").attr("value","e.g.: Sachsen").attr("style","color: #aaa").attr("onchange","searched(value)").attr("onmousedown","resetField(value)");
	//slice_par3.append("br");
	search_unit[1] = slice_par3.append("info");
	slice_par4 = slice_table.append("div").attr("class","td2")
	slice_par4.append("h").text("Legend");
	slice_par4.append("br");
	slice_par4.append("advice").text("Defines the range of each color");
	slice_par4.append("br");
	slice_par4=slice_par4.append("svg").attr("width", 200).attr("height", 120);
}

function doOverlay(){
	overlay.selectAll("path").remove();
	if(category==='states')class_vals = laender_vals = [2000000, 3000000,4000000,5000000,10000000,0];//testValueRB();
	else if(category==='units')class_vals = laender_vals = [100000,250000,500000,750000,1000000,0];//testValueRB();
	else if(category==='munics')class_vals = laender_vals = [5000, 7500,100000,250000,500000,0];//testValueRB();

	features = overlay.selectAll("path#"+category)
		.data(sliced_geoms)
		.enter()
		.append("path")
		.attr("id",category)
		.attr("class",getColorCodedClass)
		.on("mousedown",function(d){changedUS(d.properties.GEN)})
		.on("mouseover",function(d){info.update(d);});
}
function getColorCodedClass(d){
		var ewz= d.properties.EWZ;
//		ewz_cache.push(ewz);
		var str;
		if(ewz<class_vals[0])str = "cat0"; 
		else if (ewz>=class_vals[0] && ewz < class_vals[1]) str = "cat1"; 
		else if (ewz>=class_vals[1] && ewz<class_vals[2]) str = "cat2"; 
		else if (ewz>=class_vals[2] && ewz<class_vals[3]) str = "cat3";
		else if (ewz>=class_vals[3] && ewz<class_vals[4]) str = "cat4";
		else str = "cat5";

		return str;}
function project(x) {
	var point = map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
	return [point.x, point.y];}
function reset(){
	var bottomLeft = project(bounds_map[0][0]),
		    topRight = project(bounds_map[0][1]);
	mapData 	.attr("width", topRight[0] - bottomLeft[0])
		    		.attr("height", bottomLeft[1] - topRight[1])
		    		.style("margin-left", bottomLeft[0] + "px")
		    		.style("margin-top", topRight[1] + "px");
	overlay   .attr("transform", "translate(" + -bottomLeft[0] + "," + -topRight[1] + ")");
	features.attr("d",function(d){
			var new_path = path_geo({type: d.type, coordinates: d.coordinates})			
			return new_path;
	})
}
