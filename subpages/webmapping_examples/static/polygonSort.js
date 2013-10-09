function sliceParameter(div,parameter){
	this.div = div;
	this.params = parameter;
	this.div.append("h").text("Slice")
	this.div.append("br");
	this.div.append("advice").text("Slice parameter (filter index)");
	this.div.append("br");
	this.div.append("input").attr("type","text").attr("size","5").attr("name","min").attr("value",this.params[0]).attr("onChange","changedAP(value,name)");
	this.div.append("else").text(" - ");
	this.div.append("input").attr("type","text").attr("size","5").attr("name","max").attr("value",this.params[1]).attr("onChange","changedAP(value,name)");
	this.div.append("br")
}

function filterParameter(div, minimas){
	this.div = div;
	this.mins = minimas;
	this.div.append("h").text("Filter")
	this.div.append("br");
	this.div.append("advice").text("Minimum values of attributes");
	this.div.append("br");
	this.div.append("attribs").text("Area: ");
	this.div.append("input").attr("type","text").attr("size","10").attr("name","min_area").attr("value",this.mins[0]).attr("onChange","changedAP(value,name)");
	this.div.append("attribs").text(" km²");
	this.div.append("br");
	this.div.append("attribs").text("Length: ");
	this.div.append("input").attr("type","text").attr("size","5").attr("name","min_length").attr("value",this.mins[1]).attr("onChange","changedAP(value,name)");
	this.div.append("attribs").text(" km");
	this.div.append("br");
	this.div.append("attribs").text("EWZ: ");
	this.div.append("input").attr("type","text").attr("size","5").attr("name","min_ewz").attr("value",this.mins[2]).attr("onChange","changedAP(value,name)");
}

function searchParameter(div){
	this.div = div;
	this.div.append("h").text("Search");
	this.div.append("br");
	this.div.append("advice").text("Select a unit (ASC sorted)");
	this.select_unit = this.div.append("form").attr("name","unit_form").append("select").attr("name","unit_sel").attr("onChange","changedUS(value)").attr("size","3");
	this.div.append("br");
	this.div.append("advice").text("Search a unit");
	this.div.append("br");
	this.search_unit = [];
	this.search_field = this.div.append("input").attr("type","text").attr("size","15").attr("name","search_unit").attr("value","e.g.: Sachsen").attr("style","color: #aaa").attr("onchange","searched(value)").attr("onmousedown","resetField(value)");
	this.search_info = this.div.append("info");
/* 	this.getSelector=getSelector;
	function getSelector(){return this.select_unit;}
	this.getSearchUnit=getSearchUnit;
	function getSearchUnit(){return this.search_unit;}*/
	this.changeText=changeText;
	function changeText(cont){
		this.search_info.text(cont);
	}
	this.changeField=changeField;
	function changeField(cont){
		this.search_field.attr("style","color: #000").attr("value",cont);
	}
	this.changeSelectContent=changeSelectContent;
	function changeSelectContent(cont){
		this.select_unit.selectAll("option").remove();
		this.select_unit.selectAll("option").data(cont).enter().append("option").attr("value",function(d){return d}).text(function(d,i){return d});
	}
}

function legend(div){
	this.div = div;
	this.div.append("h").text("Legend");
	this.div.append("br");
	this.div.append("advice").text("Defines the range of each color");
	this.div.append("br");
	this.legendContent=this.div.append("svg").attr("width", 200).attr("height", 120);
//	this.getContent = getContent;
//	function getContent(){return this.legendContent;}
	this.addAreas = addAreas;
	function addAreas(values){
		this.legendContent.selectAll("rect").data(values).enter().append("rect").attr("class",function(d,i){return "cat"+i})
				.attr("x",140).attr("y",function(d,i){return (i*15)+15;})
				.attr("height",10).attr("width",60);
	}
	this.addText = addText;
	function addText(values){
		this.legendContent.selectAll("text").data(values).enter().append("text")
				.attr("x",10)
				.attr("y",function(d,i){return (i*15)+25;})
				.text(function(d){if(d!==0)return "Pop. < "+d; else return "Population > "})
				.attr("font-size", "14px")
				.attr("fill", "white");
	}
	this.removeText = removeText;
	function removeText(){
		this.legendContent.selectAll("text").remove();
	}
}

function transformationParameterVis(div){
	this.div = div;
	this.div.append("h").text("Transition parameter");
	this.div.append("br");
	this.div.append("advice").text("Shows the transformation parameter.");
	this.div.append("br");
	this.div.append("br");
	this.trans_par_ed = [];
	this.scaleVis = this.div.append("params");
	this.div.append("br");
	this.transitionVis = this.div.append("params");
	this.div.append("br");
	this.div.append("br");
//	this.getParam=getParam;
//	function getParam(){return this.trans_par_ed;}
	this.changeScale=changeScale;
	function changeScale(cont){
		this.scaleVis.text("Scale: "+cont);
	}
	this.changeTransition=changeTransition;
	function changeTransition(cont){
		this.transitionVis.text("Transition: X="+cont[0]+" - Y="+cont[1]);
	}
}

function selectedPolygonsVis(div){
	this.table = div.append("div").attr("class","table").append("div").attr("class","tr");

	this.getTable = getTable;
	function getTable(){return this.table;}

	this.removeAll = removeAll;
	function removeAll(){this.table.selectAll("div").remove();}

	this.addSVGContainers = addSVGContainers;
	function addSVGContainers(cont, width, heigth){
		this.svg_containers = this.table.selectAll("div").data(cont).enter().append("div").attr("class","td").attr("id",function(d,i){return d.properties.GEN}).append("svg").attr("height",heigth).attr("width",width).attr("id",function(d,i){return d.properties.GEN});
//		return this.svg_containers;
	}
	this.addRankInfo = addRankInfo;
	function addRankInfo(cont){
		this.svg_containers.append("text").text(function(d,i){return "Rank: "+(i+1)}).attr("x", cont[0]-1).attr("y", cont[1]+2).attr("class", "attrib");
	}
	this.addNameInfo = addNameInfo;
	function addNameInfo(cont){
		this.svg_containers.append("text").text(function(d){return d.properties.GEN}).attr("x", cont[0]).attr("y", cont[1]+20).attr("class","attrib");
	}
	this.addAttributeInfo = addAttributeInfo;
	function addAttributeInfo(cont){
		this.svg_containers.append("text")
			.text(function(d){
				if(attribute==='EWZ')return "EWZ: "+ d.properties.EWZ; 
				else if(attribute==='Area')return "Area: "+ (d.properties.SHAPE_AREA/1000000).toFixed(2)+" km²"
				else if(attribute==='Length')return "Length: "+ (d.properties.LENGTH/1000).toFixed(2)+" km"})
			.attr("x", cont[0]).attr("y", cont[1]+30).attr("class","attrib");
	}
	this.addPolygons = addPolygons;
	var bounds_;
	function addPolygons(scale_,trans_){
		var path = d3.geo.path().projection(normalize_projection);
		var groups = this.svg_containers.append("g").attr("transform","scale("+scale_+")");
		var polygons = groups.append("path").attr("id", "sorted").style("stroke-width",1/scale + "px").attr("transform","translate("+trans_[0]+","+trans_[1]+") scale(1,-1)")
		.attr("d",function(d){
				//reset the variable 'bounds_' as it used within the 'normalize_projection' and path is bound to it as projection
				bounds_=d3.geo.bounds(d);
				var new_path = path({type: d.type, coordinates: d.coordinates})
				return new_path;
		});
		return polygons;

	}
	//this projection normalizes the geometry...to fit into the div-svg
	function normalize_projection(x) {return [x[0]-bounds_[1][0],x[1]-bounds_[1][1]];}
}




