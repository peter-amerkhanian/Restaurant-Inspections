const L = window.L;

/**
 * Builds the OSM base layer for the map
 *
 * @returns L.TileLayer
 */
function baseLayer() {
  const osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const osmAttrib =
    'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
  return new L.TileLayer(osmUrl, { attribution: osmAttrib });
}

const LeafIcon = L.Icon.extend({
  options: {
    iconSize: [16, 16] // size of the icon
  }
});

/**
 *Sets the color of a feature according to its grade
 *
 * @param {*} feature a geojson feature
 * @returns a new LeafIcon witht the colo corresponding to the grade
 */
function setColor(feature) {
  if (feature.properties.grade == "g") {
    return new LeafIcon({ iconUrl: "../images/green-circle_1f7e2.png" });
  } else if (feature.properties.grade == "y") {
    return new LeafIcon({ iconUrl: "../images/yellow-circle_1f7e1.png" });
  } else if (feature.properties.grade == "r") {
    return new LeafIcon({ iconUrl: "../images/red-circle_1f534.png" });
  } else {
    return new LeafIcon({ iconUrl: "../images/white-circle_26aa.png" });
  }
}

/**
 * Creates the marker layer with restaurant data markers
 *
 * @returns an L.GeoJSON object with all the restaurant locations
 */
function geojsonLayer() {
  const geojsonLayer = new L.GeoJSON.AJAX("data/restaurant_map.geojson", {
    onEachFeature: function(feature, layer) {
      if (layer instanceof L.Marker) {
        layer.setIcon(setColor(feature));
      }
      layer.bindPopup(`
				<b>${feature.properties.name}</b><br/>
				${feature.properties.inspection_date}<br/>
				Grade: ${feature.properties.grade}
				`);
    }
  });
  return geojsonLayer;
}

/**
 * Initializes the map with the base layer and the restaurants
 *
 */
function initmap() {
  // set up the map
  const map = new L.Map("map");
  // Bay Area
  map.setView([37.675205, -122.141638], 10);
  // create the OSM tile
  const osm = baseLayer();
  // create the markers tile
  const gjLayer = geojsonLayer();
  osm.addTo(map);
  gjLayer.addTo(map);
  L.control
    .search({
      layer: gjLayer,
      initial: false,
      propertyName: "name", // Specify which property is searched into.
      zoom: 24
    })
    .addTo(map);
}

initmap();
