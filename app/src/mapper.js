import Leaflet from "leaflet";
import Routing from "leaflet-routing-machine";


export const MapConst = {

  TILES: {
      ORIGIN: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      DEFAULT: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
    },

  EMISSIONS: {
    INDIVIDUAL_CAR: 206
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
   *  @param {Object} m - Marker definition: lat, lng, accuracy
   */
  addApproximatedMarker(m) {
    let marker = Leaflet
      .marker([ m.lat, m.lng ])
      .addTo(this._map);

    this.addLayersOnMap([
        Leaflet
          .circle([ m.lat, m.lng ], { radius: m.accuracy })
          .addTo(this._map),
        marker
      ]);

    if (m.legend) {
      marker.bindPopup(m.legend);
    }
  }

  /**
   *  Add a simple marker to the map
   *  @param {Object} m - Marker definition: lat, lng
   */
  addMarker(m) {
    let marker = Leaflet
      .marker([ m.lat, m.lng ])
      .addTo(this._map);

    this.addLayersOnMap([marker]);

    if (m.legend) {
      marker.bindPopup(m.legend);
    }
  }

  addRoute(points, fn) {
    let waypoints = [];

    points.forEach(function(addr) {
      waypoints.push(Leaflet.latLng(parseFloat(addr.lat), parseFloat(addr.lng)));
    });

    this.addLayersOnMap([
      Leaflet.Routing
        .control({
          waypoints: waypoints
        })
        .on('routesfound', function(e) {
          if (fn && e.routes && e.routes.length > 0) {
            let route = e.routes[0];

            route.carbonEmission = (route.summary.totalDistance / 1000) * MapConst.EMISSIONS.INDIVIDUAL_CAR;

            fn(route);
          }
          else if (fn) {
            fn(false);
          }
        })
        .addTo(this._map)
    ]);
  }

}