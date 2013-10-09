function print(inhalt){
	console.log("drucke: "+inhalt);
}

function dir(object) {
    stuff = [];
    for (s in object) {
	stuff.push(s);
    }
    stuff.sort();
    return stuff;
}

	function style(feature) {
	    return {
		fillColor: getColor(feature.properties.density),
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7
	    };
	}
	function getColor(d) {
	    return d > 1000 ? '#800026' :
		   d > 500  ? '#BD0026' :
		   d > 200  ? '#E31A1C' :
		   d > 100  ? '#FC4E2A' :
		   d > 50   ? '#FD8D3C' :
		   d > 20   ? '#FEB24C' :
		   d > 10   ? '#FED976' :
		              '#FFEDA0';
	}
	function highlightFeature(e) {
	    var layer = e.target;

	    layer.setStyle({
		weight: 5,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.7
	    });

	    if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	    }
	    info.update(layer.feature.properties);
	}
	function resetHighlight(e) {
	    geojson.resetStyle(e.target);
	    info.update();
	}
	function zoomToFeature(e) {
		console.log(e.target.getBounds());
	    map.fitBounds(e.target.getBounds());
	}
	function onEachFeature(feature, layer) {
	    layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	    });
	}
		
