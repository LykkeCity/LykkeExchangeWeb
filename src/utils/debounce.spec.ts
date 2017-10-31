import {debounce} from './debounce';

const callBack = jest.fn();

describe('debounce', () => {
  let clock: typeof jest;

  beforeEach(() => {
    clock = jest.useFakeTimers();
  });

  afterEach(() => {
    clock.clearAllTimers();
  });

  it('should be defined as function', () => {
    expect(typeof debounce).toEqual('function');
  });

  it('should not execute prior to timeout', () => {
    // set up debounced function with wait of 100
    const fn = debounce(callBack, 100);

    // call debounced function at interval of 50
    setTimeout(fn, 100);
    setTimeout(fn, 150);

    // set the clock to 25 (period of the wait) ticks after the last debounced call
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 175;

    // the callback should not have been called yet
    expect(callBack.mock.calls.length).toBe(0);
  });
});
