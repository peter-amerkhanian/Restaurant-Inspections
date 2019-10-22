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
 * Creates the marker layer with Alameda County restaurant data markers
 *
 * @returns an L.GeoJSON object with all the restaurant locations
 */
function geojsonLayer() {
  const geojsonLayer = new L.GeoJSON.AJAX("data/restaurant_map.geojson", {
    onEachFeature: function(feature, layer) {
      if (layer instanceof L.Marker) {
        layer.setIcon(setColor(feature));
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

// function getViolations(feature) {
//   const violations = new Map();
//   violations.set(
//     "Contaminated Equipment",
//     Number.parseInt(feature.properties.major_violation_contaminated_equipment)
//   );
//   violations.set(
//     "Contaminated Equipment",
//     Number.parseInt(feature.properties.major_violation_contaminated_equipment)
//   );
//   violations.set(
//     "Unsafe Food Source",
//     Number.parseInt(feature.properties.major_violation_unsafe_food_source)
//   );
//   violations.set(
//     "Improper Holding Temperature",
//     Number.parseInt(
//       feature.properties.major_violation_improper_holding_temperature
//     )
//   );
//   violations.set(
//     "Inadequate Cooking",
//     Number.parseInt(feature.properties.major_violation_inadequate_cooking)
//   );
//   violations.set(
//     "Personal Hygiene",
//     Number.parseInt(feature.properties.major_violation_personal_hygiene)
//   );
//   return violations;
// }

function berkeleyGeoJson() {
  const geojsonLayer = new L.GeoJSON.AJAX(
    "https://data.cityofberkeley.info/resource/iuea-7eac.geojson",
    {
      onEachFeature: function(feature, layer) {
        layer.setIcon(
          new LeafIcon({ iconUrl: "../images/white-circle_26aa.png" })
        );
        // const date = feature.properties.inspection_date.split("T")[0];
        // const violations = getViolations(feature);
        // console.log(violations);
        // let violationMessage = "";
        // for (var [key, value] of violations) {
        //   if (value >= 1) {
        //     const message = `${key}: ${value}<br/>`;
        //     violationMessage.concat(message);
        //   }
        // }
        layer.bindPopup(`
          <b>${feature.properties.doing_business_as}</b><br/>
          ${feature.properties.inspection_date}<br/>
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
