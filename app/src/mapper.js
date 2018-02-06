import Leaflet from "leaflet";


export const MapConst = {

  TILES: {
      ORIGIN: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      DEFAULT: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
    }

};


/** ConstClass to simplify the geocoding process */
export const Geocoder = {

  /**
   *  TODO Find the position from address
   *  @param {string} addr - Address to translate 
   */
  getPosition: (addr) => {

  },


  /**
   *  TODO Find address from a specific position
   */
  getAddress: () => {

  }

};


/** ConstClass to simplify the geolocation process */
export const Geolocater = {

  _watcherId: undefined,

  /**
   *  Retrieve the current position of the user
   *  @param {Function} fnSuccess - Success callback
   *  @param {Function} fnError - Error callback
   */
  getCurrentLocation: (fnSuccess, fnError) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (fnSuccess) {
            fnSuccess(pos);
          }
        },
        (error) => {
          if (fnError) {
            fnError(error);
          }
        });
    } else {
      if (fnError) {
        fnError({
            code: 0,
            message: 'Geolocation is not supported'
          });
      }
    }
  },

  /**
   *  Follow th position of the user
   *  @param {Function} fnSuccess - Success callback
   *  @param {Function} fnError - Error callback
   */
  watchLocation: (fnSuccess, fnError) => {
    if ("geolocation" in navigator) {
      Geolocater._watcherId = navigator.geolocation.watchPosition(
        (pos) => {
          if (fnSuccess) {
            fnSuccess(pos);
          }
        },
        (err) => {
          if (fnError) {
            fnError(err);
          }
        },
        {
            enableHighAccuracy: true,
            timeout: Infinity,
            maximumAge: 0
        });
    } else {
      if (fnError) {
        fnError({
            code: 0,
            message: 'Geolocation is not supported'
          });
      }
    }
  },

  /**
   *  Stop watcher
   */
  clearWatcher: () => {
    if (Geolocater._watcherId !== undefined) {
      navigator.geolocation.clearWatch(Geolocater._watcherId);
      Geolocater._watcherId = undefined;
    }
  },

  /**
   *  Verify if a watcher is running
   *  @return {bool} True if is running
   */
  isWatching: () => {
    return Geolocater._watcherId !== undefined ? true : false;
  }

};


/** Class to manipulate OpenStreetMap implementation */
export class Mapper {

  /**
   *  Initialize the map
   *  @param {string} id - Identifier of DOM Element
   *  @param {Map options} props - Options Leaflet Map constructor
   */
  constructor(id, props) {
    this._layers = [];
    this._watcherId = undefined;

    // Save DOM Element id
    this._id = id;

    // Create map
    if (props) {
      this._map = Leaflet.map(this._id, props);
    } else {
      this._map = Leaflet.map(this._id, {
          center: [48.85, 2.35],
          zoom: 12,
          zoomControl: false
        });
    }

    // Set default tile
    this.tile = MapConst.TILES.DEFAULT;
  }

  /**
   *  Retrieve the Leaflet map
   *  @return {Map} Leaflet Map
   */
  get map() {
    return this._map;
  }

  /**
   *  Change the tile engine
   *  @param {string} addr - Title address
   */
  set tile(addr) {
    this._layers.push([ Leaflet.tileLayer(addr).addTo(this._map) ]);
  }

  /**
   *  Update the view center
   *  @param {Object} view - Definition of the new view (attrs: lat, lng, zoom)
   */
  setView(view) {
    this._map.flyTo(
      Leaflet.latLng(
        view.lat,
        view.lng),
      view.zoom);
  }

  /**
   *  Add group of layers to the map
   *  @param {Array} layers - Array of Leaflet layer
   */
  addLayersOnMap(layers) {
    this._layers.push(layers);
  }

  /**
   *  Remove the last group of layers
   */
  removeLastLayers() {
    if (this._layers.length > 1) {
      let layers = this._layers.pop();
      
      layers.forEach((layer) => {
          layer.remove();
        });

      return true;
    }

    return false;
  }

  /**
   *  Add a new marker with accuracy
   *  @param {Object} marker - Marker definition: lat, lng, accuracy
   */
  addApproximatedMarker(marker) {
    this.addLayersOnMap([
        Leaflet
          .circle([ marker.lat, marker.lng ], { radius: marker.accuracy })
          .addTo(this._map),
        Leaflet
          .marker([ marker.lat, marker.lng ])
          .addTo(this._map)                
      ]);
  }

  /**
   *  Add a simple marker to the map
   *  @param {Object} marker - Marker definition: lat, lng
   */
  addMarker(marker) {
    this.addLayersOnMap([
        Leaflet
          .marker([ marker.lat, marker.lng ])
          .addTo(this._map)                
      ]);
  }

}