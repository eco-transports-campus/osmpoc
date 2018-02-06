import Leaflet from "leaflet";


export const MapConst = {

    TILES: {
        ORIGIN: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        DEFAULT: 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
      }

  };

export class Mapper {

  constructor(id, props) {
    // Shared Constants

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
    L.tileLayer(addr).addTo(this._map);
  }

}