import { Mapper } from './mapper.js';
import Geolocater from './geolocater.js';
import Geocoder from './geocoder.js';


// When page is loaded
window.addEventListener('load', () => {

  // Initialize Map
  let map = new Mapper('map');



  function showMarker(m) {
    console.log(m)
    map.removeLastLayers();
    map.setView({ lat: m.latitude, lng: m.longitude, zoom: 12 });
    map.addMarker({ lat: m.latitude, lng: m.longitude});
  }

  // Function to find the position of an address
  function findPositionOfAddress(addr) {
    Geocoder.getPosition(addr, (data) => {
      
      console.log(data);

      map.removeLastLayers();
      data.reverse().forEach((location) => {
        map.setView({ lat: location.lat, lng: location.lon, zoom: 12 });
        map.addMarker({ lat: location.lat, lng: location.lon, legend: location.display_name });
      });
    });
  }

  // Function to find address from a position
  function findAddressOfPosition(lat, lng) {
    Geocoder.getAddress(lat, lng, (data) => {
      console.log(data);

      map.removeLastLayers();
      map.setView({ lat: data.lat, lng: data.lon, zoom: 12 });
      map.addMarker({ lat: data.lat, lng: data.lon, legend: data.display_name });
    });
  }


  // Search Test : Search Address & Position
  document.getElementById('form_search')
    .addEventListener('submit', (e) => {
      e.preventDefault();

      let query = e.target[0].value,
          splited = query.split(','),
          lat, lng;

      // Position search
      if (splited.length === 2 && (lat = parseFloat(splited[0])) && (lng = parseFloat(splited[1]))) {
        findAddressOfPosition(lat, lng);
      }

      // Address Search
      else {
        findPositionOfAddress(query);
      }
    })





  // Function to show a location marker
  function showLocationMarker(m) {
    map.removeLastLayers();
    map.setView({ lat: m.latitude, lng: m.longitude, zoom: 12 });
    map.addApproximatedMarker({ lat: m.latitude, lng: m.longitude, accuracy: m.accuracy });
  }


  // Button Test : Current Location
  document.getElementById('btn_CurrentLocation')
    .addEventListener('click', () => {
        Geolocater.getCurrentLocation(
          // User Position find
          (position) => {
            showLocationMarker(position.coords);
          },
          // User Position error
          (err) => {
            console.error(err.message);
          });
      });


  // Button Test : Watch Location
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
            showLocationMarker(position.coords)
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

});
