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
const USER_KEY = 'USER_KEY';

export default class Storage {
  constructor(window) {
    this.storageAvailable = storageAvailable(window, 'localStorage');
    this.window = window;
  }

  isStorageAvailable() {
    return this.storageAvailable;
  }

  store(name, value) {
    if (this.isStorageAvailable()) {
      try {
        this.window.localStorage.setItem(name, value);
        return true;
      } catch (e) {
        console.warn('Failed to store ' + name + ' in storage: ' + e);
        return false;
      }
    }
    return false;
  }

  get(name) {
    if (this.isStorageAvailable()) {
      // getItem() returns null if value is not stored.
      let value = this.window.localStorage.getItem(name);
      if (value) {
        return value;
      }
    }
    return '';
  }

  getUserKey() {
    return this.get(USER_KEY);
  }

  getApiKey() {
    return this.get(API_KEY);
  }

  storeKeys(userKey, apiKey) {
    return this.store(USER_KEY, userKey) && this.store(API_KEY, apiKey);
  }
}