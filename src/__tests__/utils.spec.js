import * as utils from '../js/utils.js';

describe(`Utils.js tests`, () => {
  test(`checkState_Pass`, () => {
    global.console = {error: jest.fn()}

    utils.checkState(1 == 1, 'msg');

    expect(console.error).not.toBeCalled();
  });

  test(`checkState_Fail`, () => {
    global.console = {error: jest.fn()}

    utils.checkState(false, 'msg');

    expect(console.error).toBeCalled();
  });

  test(`checkIsDefined_Pass`, () => {
    global.console = {error: jest.fn()}

    utils.checkIsDefined('var', '1');

    expect(console.error).not.toBeCalled();
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
});
