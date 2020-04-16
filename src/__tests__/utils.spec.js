import * as utils from '../js/utils.js';

describe(`Utils.js tests`, () => {
  test(`checkState_Pass`, () => {
    global.console = {error: jest.fn()}

    let b = utils.checkState(1 == 1, 'msg');

    expect(b).toEqual(true);
    expect(console.error).not.toBeCalled();
  });

  test(`checkState_Fail`, () => {
    global.console = {error: jest.fn()}

    let b = utils.checkState(false, 'value: $', 1);

    expect(b).toEqual(false);
    expect(console.error).toBeCalledWith('[ERROR] INVALID STATE: value: 1');
  });

  test(`checkIsDefined_Pass`, () => {
    global.console = {error: jest.fn()}

    utils.checkIsDefined('var', '1');
    utils.checkIsDefined('var', 0);
    utils.checkIsDefined('var', []);
    let b = utils.checkIsDefined('var', false);

    expect(console.error).not.toBeCalled();
    expect(b).toEqual(true);
  });

  test(`checkIsDefined_Fail`, () => {
    global.console = {error: jest.fn()}

    utils.checkIsDefined('var', undefined);

    expect(console.error).toBeCalled();
  });

  test(`checkIsDefined_Fail_Null`, () => {
    global.console = {error: jest.fn()}

    utils.checkIsDefined('var', null);

    expect(console.error).toBeCalled();
  });

  test(`sprintf`, () => {
    expect(utils.sprintf('$ $', 'hello', 'world')).toEqual('hello world');
    expect(utils.sprintf('$ $ $ $ $', 123, 3.14, true, null, undefined))
        .toEqual('123 3.14 true null undefined');
    expect(utils.sprintf('$', [])).toEqual('');
    expect(utils.sprintf('$', [1, 2, 3])).toEqual('1,2,3');
  });
});
