import Leaflet from "leaflet";
import Voters from "./voters.json";

let appState = {
  currentPosition: null,
};

function handleLocationFound(leafletMap, e) {
  if (appState.currentPosition) {
    // update current position
    const { currentPosition } = appState;
    currentPosition.setLatLng(e.latlng);
    currentPosition.setRadius(e.accuracy);
    appState = {
      ...appState,
      currentPosition,
    };
  } else {
    // add graphic layers once location has been granted
    Leaflet.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken: process.env.TILE_LAYER_ACCESS_TOKEN,
      }
    ).addTo(leafletMap);

    var radius = e.accuracy;
    const currentPosition = Leaflet.circleMarker(e.latlng, {
      radius,
      interactive: false,
    }).addTo(leafletMap);
    appState = {
      ...appState,
      currentPosition,
    };

    Voters.forEach((voter) => {
      const {
        firstName,
        lastName,
        streetAddress,
        partyAffiliation,
        age,
        location,
      } = voter;
      Leaflet.marker([location.lat, location.lng])
        .addTo(leafletMap)
        .bindPopup(
          `<div style="text-transform: capitalize;"><b>${firstName} ${lastName} - ${age} - ${partyAffiliation}</b><br>${streetAddress}</div>`
        );
    });
  }
}

function handleLocationError(e) {
  if (e.code === 1)
    alert(
      "We respect your privacy. Location is only used on this web page and is not sent, recorded, or analysed in anyway."
    );
}

function createMap() {
  const leafletMap = Leaflet.map("leaflet").fitWorld();
  leafletMap.on("locationfound", handleLocationFound.bind(this, leafletMap));
  leafletMap.on("locationerror", handleLocationError);
  leafletMap.locate({ watch: true, setView: true, maxZoom: 16 });
}

createMap();
