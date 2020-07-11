import Leaflet from 'leaflet';

let appState = {
  currentPosition: null
}

function handleLocationFound(leafletMap, e) {
  if (appState.currentPosition) {
    // update current position
    const {currentPosition} = appState;
    currentPosition.setLatLng(e.latlng);
    appState = {
      ...appState,
      currentPosition
    }
  } else {
    // add graphic layers once location has been granted
    Leaflet.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: TILE_LAYER_ACCESS_TOKEN,
    }).addTo(leafletMap);

    var radius = e.accuracy;
    const currentPosition = Leaflet.circle(e.latlng, radius).addTo(leafletMap);
    appState = {
      ...appState,
      currentPosition
    }
  }
}

function handleLocationError(e) {
  alert('We respect your privacy. Location is only used on this web page and is not sent, recorded, or analysed in anyway.');
}

function createMap() {
  const leafletMap = Leaflet.map('leaflet').fitWorld();
  leafletMap.on('locationfound', handleLocationFound.bind(this, leafletMap));
  leafletMap.on('locationerror', handleLocationError);
  leafletMap.locate({watch: true, setView: true, maxZoom: 16});
}

createMap();
