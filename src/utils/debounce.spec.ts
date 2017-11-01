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

  it('should be clearable', () => {
    const fn = debounce(callBack, 100);

    expect(fn).toHaveProperty('clear');
  });

  it('should not execute prior to timeout', () => {
    const fn = debounce(callBack, 100);

    // call debounced function at interval of 50
    setTimeout(fn, 100);
    setTimeout(fn, 150);

    // set the clock to 25 (period of the wait) ticks after the last debounced call
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 175;

    expect(callBack.mock.calls.length).toEqual(0);
  });

  it('should execute prior to timeout when flushed', () => {
    const fn = debounce(callBack, 100);

    // call debounced function at interval of 50
    setTimeout(fn, 100);
    setTimeout(fn, 150);

    // set the clock to 25 (period of the wait) ticks after the last debounced call
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 175;

    fn.flush();

    expect(callBack.mock.calls.length).toEqual(1);
  });

  it('should not execute again after timeout when flushed before the timeout', () => {
    const fn = debounce(callBack, 100);

    // call debounced function at interval of 50
    setTimeout(fn, 100);
    setTimeout(fn, 150);

    // set the clock to 25 (period of the wait) ticks after the last debounced call
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 175;

    fn.flush();

    expect(callBack.mock.calls.length).toEqual(1);

    // move to past the timeout
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 225;

    expect(callBack.mock.calls.length).toEqual(1);
  });

  it('should not execute on a timer after being flushed', () => {
    const fn = debounce(callBack, 100);

    // call debounced function at interval of 50
    setTimeout(fn, 100);
    setTimeout(fn, 150);

    // set the clock to 25 (period of the wait) ticks after the last debounced call
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 175;

    fn.flush();

    expect(callBack.mock.calls.length).toEqual(1);

    // schedule again
    setTimeout(fn, 250);

    // move to past the new timeout
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 400;

    expect(callBack.mock.calls.length).toEqual(2);
  });

  it('should not execute when flushed if nothing was scheduled', () => {
    const fn = debounce(callBack, 100);

    fn.flush();

    expect(callBack.mock.calls.length).toEqual(0);
  });
});
