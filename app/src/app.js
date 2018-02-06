import { Mapper, MapConst } from './mapper.js';


window.onload = function() {
  
  // Initialize Map
  let map = new Mapper('map');

  // Test : Current Location
  document.getElementById('btn_CurrentLocation')
    .addEventListener('click', () => {
        map.getCurrentLocation(
          
          // Location find
          (position) => {
              console.log(position);
            },

          // Location error
          (error) => {
              console.log(error);
            });
      });


  // Test : Watch Location
  let watchBtn = document.getElementById('btn_WatchLocation');

  watchBtn
    .addEventListener('click', () => {
      if (map.isWatching()) {
        // Stop Watcher
        map.clearWatcher();
        watchBtn.innerText = 'Watch User Location';
      } else {
        // Start Watcher
        map.watchLocation();
        watchBtn.innerText = 'Stop Watching';
      }
    });

  // Clear All Layers
  document
    .getElementById('btn_ClearLayers')
    .addEventListener('click', () => {
      while (map.removeLastLayers()) {}
    });

}