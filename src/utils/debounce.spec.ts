import {debounce} from './debounce';

describe('debounce', () => {
  let callBack: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    callBack = jest.fn();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should be defined as function', () => {
    expect(typeof debounce).toEqual('function');
  });

  it('should be clearable', () => {
    const fn = debounce(callBack, 100);

    expect(fn).toHaveProperty('clear');
  });

  it('should not execute prior to timeout', () => {
    const fn = debounce(callBack, 100);

    setTimeout(fn(), 100);
    setTimeout(fn(), 150);

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 175;

    expect(callBack.mock.calls.length).toEqual(0);
  });

  it('should execute prior to timeout when flushed', () => {
    const fn = debounce(callBack, 100);

    setTimeout(fn(), 100);
    setTimeout(fn(), 150);

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 175;

    fn.flush();

    expect(callBack.mock.calls.length).toEqual(1);
  });

  it('should not execute again after timeout when flushed before the timeout', () => {
    const fn = debounce(callBack, 100);

    setTimeout(fn(), 100);
    setTimeout(fn(), 150);

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 175;

    fn.flush();

    expect(callBack.mock.calls.length).toEqual(1);

    // move to past the timeout
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 225;

    expect(callBack.mock.calls.length).toEqual(1);
  });

  it('should not execute when flushed if nothing was scheduled', () => {
    const fn = debounce(callBack, 100);

    fn.flush();

    expect(callBack.mock.calls.length).toEqual(0);
  });
});
