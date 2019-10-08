const L = window.L


/**
 * Builds the OSM base layer for the map
 *
 * @returns L.TileLayer
 */
function baseLayer() {
	const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	const osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
	return new L.TileLayer(osmUrl, { attribution: osmAttrib });
}

/**
 *
 *
 * @param {*} feature 
 * @returns
 */
function setColor(feature) {
	if (feature.properties.grade == "g") {
		return {
			fillColor: "#05ad00"
		};
	} else if (feature.properties.grade == "y") {
		return {
			fillColor: "#e1f000"
		};
	} else if (feature.properties.grade == "r") {
		return {
			fillColor: "#d90000"
		};
	} else {
		return {
			fillColor: "#ffffff"
		};
	}
}

/**
 * Creates the marker layer with restaurant data
 *
 * @returns L.GeoJSON
 */
function geojsonLayer() {
	const baseStyle = {
		"fillColor": "#ffffff",
		"color": "#000000",
		"weight": 1,
		"opacity": 1,
		"radius": 7,
		"fill": true,
		"fillOpacity": 1
	};
	const geojsonLayer = new L.GeoJSON.AJAX("data/restaurant_map.geojson",
		{
			pointToLayer: function (geoJsonPoint, latlng) {
				return L.circleMarker(latlng, baseStyle);
			},
			style: setColor,
			onEachFeature: function (feature, layer) {
				layer.bindPopup(`
				<b>${feature.properties.name}</b><br/>
				${feature.properties.inspection_date}<br/>
				Grade: ${feature.properties.grade}
				`);
			}
		});
	geojsonLayer.style = baseStyle;
	return geojsonLayer;
}


function initmap() {
	// set up the map
	const map = new L.Map('map');
	// Bay Area
	map.setView([37.765205, -122.241638], 10);
	// create the OSM tile
	const osm = baseLayer();
	osm.addTo(map);
	// create the markers tile
	const gjLayer = geojsonLayer();
	gjLayer.addTo(map);

}
initmap();
