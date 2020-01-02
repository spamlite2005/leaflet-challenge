// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// var accessToken = API_KEY
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    // L.circle(feature.geometry.coordinates[0,1], feature.properties.mag);
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + " Magnitude:" + feature.properties.mag + "</p>");
  }

  function color(mag) {
    if (mag >= 5.0) {
      return "#D35400"
    }
    else if (mag >= 4.0) {
      return "#E67E22"
    }
    else if (mag >= 3.0) {
      return "#F39C12"
    } 
    else if (mag >= 2.0) {
      return "#F1C40F"
    } 
    else if (mag >= 1.0) {
      return "#FFF833"
    }
    else {
      return "#75FF33"
    }
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
      return new L.CircleMarker(latlng, {
        // onEachFeature: onEachFeature,
        radius: 10^(feature.properties.mag), 
        color: "black",
        fillColor: color(feature.properties.mag),
        stroke: true,
        weight: 1,
        fillOpacity: 0.65,
        // style: function(feature) {
        //   var mag = feature.properties.mag;
        //   if (mag >= 5.0) {
        //     return {fillColor: "red"};
        //   }
        //   else if (mag >= 4.0) {
        //     return {fillColor: "red"};
        //   }
        //   else if (mag >= 3.0) {
        //     return {fillColor: "orange"};
        //   } 
        //   else if (mag >= 2.0) {
        //     return {fillColor: "yellow"};
        //   } 
        //   else if (mag >= 1.0) {
        //     return {fillColor: "green"};
        //   }
        //   else {
        //     return {fillColor: "blue"};
        //   }
        // // }
      })}});
 
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}


function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    // Magnitudes: magnitudes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

