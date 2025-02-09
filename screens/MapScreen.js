import React, { useEffect, useRef } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { WebView } from "react-native-webview";

const MapScreen = () => {
  const route = useRoute();
  const coordinates = [];

  // Prepare coordinates for markers
  route.params.searchResults.forEach((item) =>
    item.properties.forEach((prop) => {
      coordinates.push({
        latitude: Number(prop.latitude),
        longitude: Number(prop.longitude),
        name: prop.name,
        price: prop.newPrice,
      });
    })
  );

  const mapHtml = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <style>
          html, body, #map { width: 100%; height: 100%; margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([${coordinates[0]?.latitude || 51.505}, ${coordinates[0]?.longitude || -0.09}], 10);
          
          // Add OpenStreetMap tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          // Loop through coordinates and add markers
          ${coordinates
            .map(
              (coord) => `
                var marker = L.marker([${coord.latitude}, ${coord.longitude}]).addTo(map);
                marker.bindPopup('<b>${coord.name}</b><br>Price: $${coord.price}');
              `
            )
            .join("")}
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: mapHtml }}
        javaScriptEnabled={true}
        onError={(error) => console.error("WebView Error:", error)}
        onHttpError={(error) => console.error("HTTP Error:", error)}
        onLoad={() => console.log("Map loaded successfully")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MapScreen;
