import Leaflet from "leaflet";


export const MapConst = {

    TILES: {
        ORIGIN: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        DEFAULT: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
      }

  };

export class Mapper {

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

  get mapId() {
    return this._id;
  }

  get map() {
    return this._map;
  }

  set tile(addr) {
    this._layers.push([ Leaflet.tileLayer(addr).addTo(this._map) ]);
  }

  addLayersOnMap(layers) {
    this._layers.push(layers);
  }

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

  getCurrentLocation(fnSuccess, fnError) {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (fnSuccess) {
            fnSuccess(pos);
          }

          this.removeLastLayers();
          this._map.flyTo(Leaflet.latLng(pos.coords.latitude, pos.coords.longitude), 12);
          this.addLayersOnMap([
              Leaflet
                .circle([ pos.coords.latitude, pos.coords.longitude ], { radius: pos.coords.accuracy })
                .addTo(this._map),
              Leaflet
                .marker([ pos.coords.latitude, pos.coords.longitude ])
                .addTo(this._map)                
            ]);
        },
        (error) => {
          if (fnError) {
            fnError(error);
          }
        });
    } else {
      console.error('Geolocation is not supported');

      if (fnError) {
        fnError({
            code: 0,
            message: 'Geolocation is not supported'
          });
      }
    }
  }

  watchLocation(fnSuccess, fnError) {
    if ("geolocation" in navigator) {
      this._watcherId = navigator.geolocation.watchPosition(
        (pos) => {
          if (fnSuccess) {
            fnSuccess(pos);
          }

          this.removeLastLayers();
          this._map.flyTo(Leaflet.latLng(pos.coords.latitude, pos.coords.longitude), 12);
          this.addLayersOnMap([
              Leaflet
                .circle([ pos.coords.latitude, pos.coords.longitude ], { radius: pos.coords.accuracy })
                .addTo(this._map),
              Leaflet
                .marker([ pos.coords.latitude, pos.coords.longitude ])
                .addTo(this._map)                
            ]);
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
      console.error('Geolocation is not supported');

      if (fnError) {
        fnError({
            code: 0,
            message: 'Geolocation is not supported'
          });
      }
    }
  }

  clearWatcher() {
    if (this._watcherId !== undefined) {
      navigator.geolocation.clearWatch(this._watcherId);
      this._watcherId = undefined;
    }
  }

  isWatching() {
    return this._watcherId !== undefined ? true : false;
  }

}