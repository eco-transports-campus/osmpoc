import { Mapper, Geolocater, MapConst } from './mapper.js';


window.onload = function() {

  // Initialize Map
  let map = new Mapper('map');

  console.log(MapConst);


  function showLocationMarker(pos) {
    map.removeLastLayers();
    map.setView({ lat: pos.coords.latitude, lng: pos.coords.longitude, zoom: 12 });
    map.addApproximatedMarker({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
  }


  // Test : Current Location
  document.getElementById('btn_CurrentLocation')
    .addEventListener('click', () => {
        Geolocater.getCurrentLocation(
          // User Position find
          (position) => {
            showLocationMarker(position);
          },
          // User Position error
          (err) => {
            console.error(err.message);
          });
      });


  // Test : Watch Location
  let watchBtn = document.getElementById('btn_WatchLocation');

  watchBtn
    .addEventListener('click', () => {
      if (Geolocater.isWatching()) {
        // Stop Watcher
        Geolocater.clearWatcher();
        watchBtn.innerText = 'Watch User Location';
      } else {
        // Start Watcher
        watchBtn.innerText = 'Stop Watching';
        Geolocater.watchLocation(
          (position) => {
            showLocationMarker(position)
          },
          (err) => {
            console.error(err.message);
          });
      }
    });


  // Clear All Layers
  document
    .getElementById('btn_ClearLayers')
    .addEventListener('click', () => {
      while (map.removeLastLayers()) {}
    });

}