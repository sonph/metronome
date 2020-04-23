/* Check if local storage is available.
 * From https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
 */
function storageAvailable(window, type) {
  var storage;
  try {
    storage = window[type];
    var x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch(e) {
    return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      (storage && storage.length !== 0);
  }
}

const API_KEY = 'API_KEY';

export default class Storage {
  constructor(window) {
    this.storageAvailable = storageAvailable(window, 'localStorage');
    this.window = window;
  }

  isStorageAvailable() {
    return this.storageAvailable;
  }

  storePasteBinKey(key) {
    if (this.isStorageAvailable()) {
      try {
        this.window.localStorage.setItem(API_KEY, key);
        return true;
      } catch (e) {
        console.warn('Failed to set store api key in storage: ' + e);
        return false;
      }
    }
    return false;
  }

  getPasteBinKey() {
    if (this.isStorageAvailable()) {
      // getItem() returns null if value is not stored.
      let key = this.window.localStorage.getItem(API_KEY);
      if (key) {
        return key;
      }
    }
    return '';
  }
}