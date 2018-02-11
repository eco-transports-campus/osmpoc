
/** ConstClass to simplify the geocoding process */
export default class Geocoder {

  /**
   *  TODO Find the position from address
   *  @param {string} addr - Address to translate 
   */
  static getPosition(addr, fnSuccess) {
    $.getJSON('https://nominatim.openstreetmap.org/search?format=json&q=' + addr, (data) => {
      if (fnSuccess) {
        fnSuccess(data);
      }
    })
  }


  /**
   *  TODO Find address from a specific position
   */
  static getAddress(lat, lng, fnSuccess) {
    $.getJSON(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, (data) => {
      if (fnSuccess) {
        fnSuccess(data);
      }
    })
  }

}