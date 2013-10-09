function scrollBar(menuContainer, mapParams){

	var 	barHeight = 20
		barWidth = mapParams[0]
		folded = false
		offset = 17
		foldOffset = 40
		barPositionX = mapParams[2]-barHeight-offset;
	this.indicatorCache = {};

	var scrollGroup = menuContainer.append("g");
	var indicatorGroup = menuContainer.append("g");
	
	var scrollHead = scrollGroup.append("rect")
		                 .attr("x", 0)
		                 .attr("y", barPositionX-foldOffset)
				 .attr("rx", 20)
		                 .attr("ry", 20)
		                    .attr("width", barWidth)
		                    .attr("height", 60);
	var scrollbar = scrollGroup.append("rect")
		                    .attr("x", 0)
		                    .attr("y", barPositionX)
		                    .attr("width", barWidth)
		                    .attr("height", barHeight);
	var indicator = scrollGroup.append("rect") 
		.attr("x",barWidth/2) 
		.attr("y",barPositionX)
		.attr("opacity",.5) 
		.attr("width",10) 
		.attr("height",barHeight)
		.style("fill","#ff00ff");
	var text = scrollGroup.append("text")
		.attr("x", barWidth/2)
		.attr("y", barPositionX-25)
		.text( "Scrollbar")
		.attr("class","scroll_head");

	var textGroup = scrollGroup.append("g");

	//initialize the scale for the axis of the scrollbar
	var axisScale = d3.scale.sqrt();
		
	//and all other global callable varaibles
	var formatArea = d3.format(".2r")
	formatPercent = d3.format(".2%");
	
	//define the listeners
	//indicator.on("mousedown",setMinArea);
	scrollHead.on("mousedown",fold);
	text.on("mousedown",fold);
	//fold();

	function fold(){
	 if(folded==false){var value=barHeight+foldOffset;folded=true}
	 else {var value=0;folded=false}
	 scrollGroup.transition().attr("transform","translate(0,"+value+")").duration(1500).ease("bounce");
	 indicatorGroup.transition().attr("transform","translate(0,"+value+")").duration(1500).ease("bounce");
	}
	this.addVariableText = addVariableText;
	function addVariableText(){
		this.textInterMinArea = textGroup.append("text")
			.attr("class", "info")
			.attr("x", 0)
			.attr("y", barPositionX-10)
			.text("Current Smallest Area: ")
			.attr("class","scroll_text3");
	}
	this.addFixedText = addFixedText;
	function addFixedText(){
		this.textFixedMinArea = textGroup.append("text")
			.attr("class", "info")
			.attr("x", barWidth)
			.attr("y", barPositionX-10)
			.text("Fixed Smallest Area: ")
			.attr("class","scroll_text2");
	}
	this.addZoomText = addZoomText;
	function addZoomText(){
		this.textZoom = textGroup.append("text")
			.attr("class", "info")
			.attr("x", barWidth/2)
			.attr("y", barPositionX-10)
			.text("Zoomlevel: ")
			.attr("class","scroll_text1");
	}

	this.getScrollbar=getScrollbar;
	function getScrollbar(){ return scrollbar; }
	this.getIndicator=getIndicator;
	function getIndicator(){ return indicator; }

	this.defineAxis=defineAxis;
	function defineAxis(values){
		var minValue = values[0], maxValue = values[1];
		axisScale.domain([minValue,maxValue])
			 .range([0,960]);
		var formatNumber = d3.format(",.r"), // for formatting integers
			formatCurrency = function(d) { return formatNumber(d); };
		var xAxis = d3.svg.axis()
			.scale(axisScale)
			.orient("bottom")
			.ticks(10);
		var xAxisGroup = scrollGroup.append("g")
			.attr("class", "axis")
			.call(xAxis)
			.attr("transform","translate(0,"+(menuHeight-offset)+")")
			.selectAll("text").attr("text-anchor",function(d,i){
				if(i==minValue)return "start";
				else if (i==maxValue)return "end";
				else return "middle";});

		return axisScale;
	}
	this.updateInterText=updateInterText;
	function updateInterText(value){
		this.textInterMinArea.text(this.textInterMinArea.text().split(": ")[0]+": "+value.toFixed(6));
	}
	this.updateFixedText=updateFixedText;
	function updateFixedText(value){
		this.textFixedMinArea.text(this.textFixedMinArea.text().split(": ")[0]+": "+value.toFixed(6));
	}
	this.updateZoom=updateZoom;
	function updateZoom(map){
	this.textZoom.text(this.textZoom.text().split(": ")[0]+": "+map.getZoom());
	//updateFixedText();
	return map.getZoom();
	}
	this.addFixedIndicator=addFixedIndicator;
	function addFixedIndicator(value, zoom, minVal){
		this.indicatorCache[zoom] = [];
		this.indicatorCache[zoom][0] = indicatorGroup.append("rect")
			.attr("x", value-5)
			.attr("y", barPositionX)
			.attr("class", "indicator")
			.attr("width",10) 
			.attr("height",barHeight); 
		this.indicatorCache[zoom][1] = indicatorGroup.append("text")
			.attr("x",value)
			.attr("y", barPositionX+14)
			.text(zoom)
			.attr("font-family", "sans-serif")
			.attr("font-size", "14px")
			.style("text-anchor","middle")				
			.attr("fill", "white");
		this.indicatorCache[zoom][2] = minVal;


	}
	this.updateFixedIndicator=updateFixedIndicator;
	function updateFixedIndicator(value, zoom, minVal){
		this.indicatorCache[zoom][0].attr("x", value-5)
		this.indicatorCache[zoom][1].attr("x", value)
		this.indicatorCache[zoom][2] = minVal;			
	}
	

	
}
