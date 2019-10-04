var map


function initmap() {
	// set up the map
	map = new L.Map('map');
	// Bay Area
    map.setView([37.765205, -122.241638],10);

	// create the OSM tile
	var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 12, attribution: osmAttrib});		
	map.addLayer(osm);
}

initmap();
