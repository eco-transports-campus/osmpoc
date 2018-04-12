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
    map.addMarker({ lat: m.latitude, lng: m.longitude });
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

  // Function to find the position of an address
  function findRoute(addr_list) {
    let location_list = [];

    map.removeLastLayers();
    addr_list.forEach((query) => {
      if (query.type === 'address') {
        Geocoder.getPosition(query.query, (data) => {
          if (data.length > 0) {
            location_list.push({
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon)
            });
            map.addRoute(location_list);
          }
        });
      } else if (query.type === 'location') {
        location_list.push({
          lat: parseFloat(query.lat),
          lng: parseFloat(query.lng)
        });
        map.addRoute(location_list);
      }
    });

  }



  // Search Test : Search Address & Position
  document.getElementById('form_search')
    .addEventListener('submit', (e) => {
      e.preventDefault();

      let queries = [];

      for (let i = 0; i < e.target.length; i++) {
        let query = e.target[i].value;

        if (query !== 'search') {
          let splited = query.split(','),
            lat, lng;

          // Position search
          if (splited.length === 2 && (lat = parseFloat(splited[0])) && (lng = parseFloat(splited[1]))) {
            queries.push({
              type: 'location',
              lat: lat,
              lng: lng
            });
          }

          // Address Search
          else {
            queries.push({
              type: 'address',
              query: query
            });
          }
        }
      }

      // Un champ de recherche
      if (queries.length === 1) {
        // Position search
        if (queries[0].type === 'location') {
          findAddressOfPosition(queries[0].lat, queries[0].lng);
        }

        // Address Search
        else if (queries[0].type === 'address') {
          findPositionOfAddress(queries[0].query);
        }
      }

      // Plusieurs champs de recherches
      else {
        findRoute(queries);
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
      while (map.removeLastLayers()) { }
    });

});
