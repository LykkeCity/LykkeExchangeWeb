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

    fn();

    jest.runTimersToTime(90);

    expect(callBack.mock.calls.length).toEqual(0);
  });

  it('should execute prior to timeout when flushed', () => {
    const fn = debounce(callBack, 100);

    fn();

    jest.runTimersToTime(150);

    fn.flush();

    expect(callBack.mock.calls.length).toEqual(1);
  });

  it('should not execute again after timeout when flushed before the timeout', () => {
    const fn = debounce(callBack, 100);

    fn();

    jest.runTimersToTime(120);

    fn.flush();

    expect(callBack.mock.calls.length).toEqual(1);

    // move to past the timeout
    jest.runTimersToTime(225);

    expect(callBack.mock.calls.length).toEqual(1);
  });

  it('should not execute when flushed if nothing was scheduled', () => {
    const fn = debounce(callBack, 100);

    fn.flush();

    expect(callBack.mock.calls.length).toEqual(0);
  });

  it('should be debounces function', () => {
    const fn = debounce(callBack, 100);

    fn();
    expect(callBack).not.toBeCalled();

    jest.runTimersToTime(50);
    expect(callBack).not.toBeCalled();

    jest.runTimersToTime(100);

    expect(callBack).toBeCalled();
    expect(callBack.mock.calls.length).toBe(1);
  });

  it('should return results if immidate call', () => {
    const callBackWithArgs = jest.fn((i: number) => i * 2);
    const fn = debounce(callBackWithArgs, 100, true);

    const result = fn(2);

    expect(callBackWithArgs).toBeCalled();
    expect(callBackWithArgs.mock.calls.length).toBe(1);
    expect(result).toBe(4);
  });
});
