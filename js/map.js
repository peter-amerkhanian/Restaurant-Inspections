var map;

function baseLayer() {
	var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
	return new L.TileLayer(osmUrl, {maxZoom: 12, attribution: osmAttrib });
}


function initmap() {
	// set up the map
	map = new L.Map('map');
	// Bay Area
	map.setView([37.765205, -122.241638], 10);
	// create the OSM tile
	var osm = baseLayer();
	osm.addTo(map);
	var geojsonLayer = new L.GeoJSON.AJAX("data/restaurant_map.geojson");
	geojsonLayer.addTo(map);

}
initmap();
