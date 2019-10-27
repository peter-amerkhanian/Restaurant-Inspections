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
 * @param {*} source a string with 'ac' or 'berkeley'
 * @returns a new LeafIcon witht the colo corresponding to the grade
 */
function setColor(feature, source) {
  if (source == "ac") {
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
  else if (source == "berkeley") {
    if (feature.properties.major_violations > 0) {
      return new LeafIcon({ iconUrl: "../images/red-circle_1f534.png" });
    } else if (feature.properties.minor_violations > 0) {
      return new LeafIcon({ iconUrl: "../images/yellow-circle_1f7e1.png" });
    } else {
      return new LeafIcon({ iconUrl: "../images/green-circle_1f7e2.png" });
    }
  }
  else {
    console.log("Error in color setting - source must be 'ac' or 'berkeley'");
  }
}

/**
 * Creates the marker layer with Alameda County restaurant data markers
 *
 * @returns an L.GeoJSON object with all the restaurant locations
 */
function geojsonLayer() {
  const geojsonLayer = new L.GeoJSON.AJAX("data/restaurant_map.geojson", {
    onEachFeature: function(feature, layer) {
      if (layer instanceof L.Marker) {
        layer.setIcon(setColor(feature, "ac"));
      }
      const grade = feature.properties.grade;
      let message;
      if (grade == "g" || grade == "y") {
        message = "(Corrected during inspection).";
      } else {
        message = "(Not corrected during inspection).";
      }
      layer.bindPopup(`
				<b>${feature.properties.doing_business_as}</b><br/>
				${feature.properties.inspection_date}<br/>
        Grade: ${grade}<br/>
        Rule violated: "${feature.properties.violation_description}" ${message}
				`);
    }
  });
  return geojsonLayer;
}

function berkeleyGeoJson() {
  const geojsonLayer = new L.GeoJSON.AJAX(
    "data/berkeley_restaurant_map.geojson",
    {
      onEachFeature: function(feature, layer) {
        if (layer instanceof L.Marker) {
          layer.setIcon(setColor(feature, "berkeley"));
        }
        let date;
        if (feature.properties.inspection_date) {
          date = feature.properties.inspection_date.split("T")[0];
        } else {
          date = feature.properties.inspection_date;
        }
        layer.bindPopup(`
          <b>${feature.properties.doing_business_as}</b><br/>
          ${date}<br/>
          Major violations: ${feature.properties.major_violations}<br/>
          Minor violations: ${feature.properties.minor_violations}
          `);
      }
    }
  );
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
  // create the markers layers
  const gjLayer = geojsonLayer();
  const berkeleyLayer = berkeleyGeoJson();
  // combine markers layers into one
  const pointLayer = L.featureGroup([gjLayer, berkeleyLayer]);
  osm.addTo(map);
  pointLayer.addTo(map);
  L.control
    .search({
      layer: pointLayer,
      initial: false,
      propertyName: "doing_business_as", // Specify which property is searched into.
      zoom: 20,
      collapsed: false,
      textPlaceholder: "Search by Restaurant Name",
      container: "searchBox"
    })
    .addTo(map);
}

initmap();
