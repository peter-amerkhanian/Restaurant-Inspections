var map;

function baseLayer() {
	var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
	return new L.TileLayer(osmUrl, { attribution: osmAttrib });
}

function geojsonLayer() {
	var myStyle = {
		"color": "#7135ff",
		"weight": 2,
		"opacity": 1,
		"radius": 4
	};
	var geojsonLayer = new L.GeoJSON.AJAX("data/restaurant_map.geojson",
		{
			pointToLayer: function (geoJsonPoint, latlng) {
				return L.circleMarker(latlng, myStyle);
			},
			onEachFeature: function (feature, layer) {
				layer.bindPopup("<b>" + feature.properties.name + "</b><br/>" + feature.properties.inspection_date);
			}
		});
	geojsonLayer.style = myStyle;
	return geojsonLayer;
}


function initmap() {
	// set up the map
	map = new L.Map('map');
	// Bay Area
	map.setView([37.765205, -122.241638], 10);
	// create the OSM tile
	var osm = baseLayer();
	osm.addTo(map);
	// create the markers tile
	var gjLayer = geojsonLayer();
	gjLayer.addTo(map);

}
initmap();
