function changeVisualisation(){
//!!!Achtung hier fehlt noch eine Fehlerabfangung...wenn 0 geometrien vorhanden sind!!!
	//Filter the geometries...1st...for INDEX
	sliced_geoms = objects.geometries.slice(slice_params[0],slice_params[1])
	//...2nd...for defined minimum values of ATTRIBUTES
	sliced_geoms = sliced_geoms.filter(function(d){return d.properties.EWZ>min_attribs[2] && d.properties.SHAPE_AREA>(min_attribs[0]*1000000) && d.properties.LENGTH>(min_attribs[1]*1000);});
	//update the element counter
	element_count_VIS[0].text("Total number of municipalities = "+objects.geometries.length);
	element_count_VIS[1].text("...after filtering = "+sliced_geoms.length+" geometries")
	//sort Polygons in relation to a chosen attribute
	sliced_geoms = sortPolygons(sliced_geoms,attribute);
	//add the sliced and sorted polygon name to the unit selector
	var sorted_names = sliced_geoms.map(function(d){return d.properties.GEN})
	sorted_names=sorted_names.sort();
	//add the sorted names to the selection for Search
	searchParams.changeSelectContent(sorted_names);
	//...add the whole geometry to the map
	doOverlay();
	reset();
	map.on("viewreset", reset);
	//fill the legend with content
	legendVis.addAreas(class_vals);
	legendVis.removeText();
	legendVis.addText(class_vals);
	//add the Visualiation on the sorted polygons
	selPolyVis.removeAll();
	selPolyVis.addSVGContainers(sliced_geoms,w_svg,h_svg);
	selPolyVis.addRankInfo(info_pos);
	selPolyVis.addNameInfo(info_pos);
	selPolyVis.addAttributeInfo(info_pos);
	var polygonVis = selPolyVis.addPolygons(scale,trans,objects.geometries)
	polygonVis.attr("class", function(d){return getColorCodedClass(d)})
		.on("mousedown",zoomToObject);	
}

function zoomToObject(d){
	var geom;
	objects.geometries.forEach(function(e){if(d.properties.GEN===e.properties.GEN)geom=e})
	var local_bounds = d3.geo.bounds(d),
	center = new L.LatLng(local_bounds[0][1]+((local_bounds[1][1]-local_bounds[0][1])/2),local_bounds[0][0]+((local_bounds[1][0]-local_bounds[0][0])/2)),
	southWest = new L.LatLng(local_bounds[0][1], local_bounds[0][0]),
	northEast = new L.LatLng(local_bounds[1][1], local_bounds[1][0]);
	var local_bounds = new L.LatLngBounds(southWest, northEast);
	map.setView( center, map.getBoundsZoom( local_bounds));
	window.location.hash="#map";
}
function reset(){
	overLayer.resetView(d3.geo.bounds(objects));
}
function doOverlay(){
	overLayer.removeAll();
	if(category==='states')class_vals = laender_vals = [2000000, 3000000,4000000,5000000,10000000,0];//testValueRB();
	else if(category==='units')class_vals = laender_vals = [100000,250000,500000,750000,1000000,0];//testValueRB();
	else if(category==='munics')class_vals = laender_vals = [5000, 7500,100000,250000,500000,0];//testValueRB();
	overLayer.addGeometries(sliced_geoms,"path#"+category);
	var overlayFeats = overLayer.features;
	overlayFeats.on("mousedown",function(d){changedUS(d.properties.GEN)})
		.on("mouseover",function(d){info.update(d);})
		.attr("class",function(d){return getColorCodedClass(d)})
		.attr("id",category);
}

//this function adds and defines the additional parameters for the pre-filtering
function setInfoText(){
	//add information on the transformation parameter...to the first table
	var trans_par = d3.select("#text.upper").select('div.table').select('div.tr').append("div").attr("class","td2")
	transVis = new transformationParameterVis(trans_par);
	//add a new table to the text-div
	var table2 = d3.select("#text.upper").append("div").attr("class","table").append("div").attr("class","tr");
	//add information on slice parameter
	var spalte1 = table2.append("div").attr("class","td2");
	sliceParams = new sliceParameter(spalte1, slice_params);
	//add information on pre-filtering
	var spalte2 = table2.append("div").attr("class","td2");
	var filterParams = new filterParameter(spalte2, min_attribs);
	//add search and selection
	var spalte3 = table2.append("div").attr("class","td2");
	searchParams = new searchParameter(spalte3);
	//add a legend
	var spalte4 = table2.append("div").attr("class","td2")
	legendVis = new legend(spalte4);
}
function changedCat(value){
	category = value;
	//define the 'objects' - variable...means which category is stored in there
	if(value==='munics'){objects=munics;scale = 50; trans =[0.75,0.25];}
	else if(value==='units'){objects=units;scale = 25; trans =[2,0.5];}
	else if(value==='states'){objects=states;scale = 15; trans =[5,0];}

	//change the infoText on the Transition
	transVis.changeScale(scale);
	transVis.changeTransition(trans);

	changeVisualisation();
}
function changedAP(value,name){
	//re-define ATTRIBUTE- and INDEX-Filterind
	if(name==='min_ewz'){min_attribs[2]=value;} 
	else if(name==='min_area'){min_attribs[0]=value;}
	else if(name==='min_length'){min_attribs[1]=value;}
	else if(name==='min')slice_params[0]=value; 
	else if(name==='max')slice_params[1]=value; 

	changeVisualisation();}

function changedRB(value){
	attribute=value; 

	changeVisualisation();}

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
		searchParams.changeText("'"+value+"' has been found at position "+where);
		window.location.hash=value;
		highlightSelectedDiv(value);
	}
	else searchParams.changeText("Sorry! - '"+value+"' does not exist!");}
//this function resets the initial value of the search field...when clicked into it
function resetField(){searchParams.changeField("");}

function sortPolygons(data, attrib){
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

