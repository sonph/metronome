import Storage from '../js/storage.js';

describe(`storage.js tests`, () => {
  test(`storage available`, () => {
    let s = new Storage(window);
    expect(s.isStorageAvailable()).toEqual(true);
  });

  test(`store and get keys`, () => {
    let s = new Storage(window);

    expect(s.store('key1', 'value1')).toEqual(true);
    expect(s.get('key1')).toEqual('value1');
  });

  // This is more of a behavior test.
  test(`empty string key`, () => {
    let s = new Storage(window);

    expect(s.store('', 'value1')).toEqual(true);
    expect(s.get('')).toEqual('value1');
  });

  test(`get non existing keys`, () => {
    let s = new Storage(window);
    expect(s.get('nonexistent')).toEqual('');
  });

  test(`storage not available`, () => {
    Object.defineProperty(window, 'localStorage', {
     value: undefined
   });

    let s = new Storage(window);

    expect(s.isStorageAvailable()).toEqual(false);
    expect(s.store('key1', 'value1')).toEqual(false);
    expect(s.get('key1')).toEqual('');
  });
});