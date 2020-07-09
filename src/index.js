import Leaflet from 'leaflet';

function component() {
  const mapDiv = document.createElement('div');
  mapDiv.id = 'leaflet'
  mapDiv.style.cssText = 'height: 100vh; width: auto; max-height: 1080px;'
  return mapDiv;
}

document.body.appendChild(component());

function createMap() {
  const theMap = Leaflet.map('leaflet').setView([35.6008333, -82.5541667], 13);

  Leaflet.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: TILE_LAYER_ACCESS_TOKEN,
  }).addTo(theMap);
}

createMap();
