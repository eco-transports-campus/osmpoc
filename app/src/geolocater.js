/** Class to simplify the geolocation process */
export default class Geolocater {

  constructor() {
    this._watcherId = undefined;
  }

  /**
   *  Retrieve the current position of the user
   *  @param {Function} fnSuccess - Success callback
   *  @param {Function} fnError - Error callback
   */
  static getCurrentLocation(fnSuccess, fnError) {
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
  }

  /**
   *  Follow th position of the user
   *  @param {Function} fnSuccess - Success callback
   *  @param {Function} fnError - Error callback
   */
  static watchLocation(fnSuccess, fnError) {
    if ("geolocation" in navigator) {
      this._watcherId = navigator.geolocation.watchPosition(
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
  }

  /**
   *  Stop watcher
   */
  static clearWatcher() {
    if (this._watcherId !== undefined) {
      navigator.geolocation.clearWatch(this._watcherId);
      this._watcherId = undefined;
    }
  }

  /**
   *  Verify if a watcher is running
   *  @return {bool} True if is running
   */
  static isWatching() {
    return this._watcherId !== undefined ? true : false;
  }

}