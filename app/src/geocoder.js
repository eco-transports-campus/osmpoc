
/** ConstClass to simplify the geocoding process */
export default class Geocoder {

  /**
   *  Find the position from address
   *  @param {string} addr - Address to translate 
   *  @param {Function} fnSuccess - Success callback
   */
  static getPosition(addr, fnSuccess) {
    $.getJSON('https://nominatim.openstreetmap.org/search?format=json&q=' + addr, (data) => {
      if (fnSuccess) {
        fnSuccess(data);
      }
    })
  }


  /**
   *  Find address from a specific position
   *  @param {float} lat - Latitude 
   *  @param {float} lng - Longitude
   *  @param {Function} fnSuccess - Success callback
   */
  static getAddress(lat, lng, fnSuccess) {
    $.getJSON(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, (data) => {
      if (fnSuccess) {
        fnSuccess(data);
      }
    })
  }

}