import {checkForTrailingZero, formattedNumber} from '.';

describe('Test locale for number and date', () => {
  it('should return string number with locale', () => {
    expect(checkForTrailingZero('50000,05000')).toBe('50000,050');
    expect(checkForTrailingZero('50000,050004')).toBe('50000,050004');
    expect(checkForTrailingZero('50000,0000')).toBe('50000,00');
    expect(checkForTrailingZero('50000,1000')).toBe('50000,10');

    expect(checkForTrailingZero('50000.05000')).toBe('50000.050');
    expect(checkForTrailingZero('50000.050004')).toBe('50000.050004');
    expect(checkForTrailingZero('50000.0000')).toBe('50000.00');
    expect(checkForTrailingZero('50000.1000')).toBe('50000.10');
  });

  it('should return pure value', () => {
    expect(checkForTrailingZero('1.234')).toBe('1.234');
  });

  it('should return value with right quantity of trailing zeroes', () => {
    expect(formattedNumber(5, 5)).toBe('5.00');
    expect(formattedNumber(5.234, 5)).toBe('5.2340');
    expect(formattedNumber(5.23455, 5)).toBe('5.23455');
  });

  it('should replace not a number value with 0', () => {
    expect(formattedNumber(undefined as any, 5)).toBe('0.00');
    expect(formattedNumber(null as any, 5)).toBe('0.00');
    expect(formattedNumber(Infinity, 5)).toBe('0.00');
    expect(formattedNumber(true as any, 5)).toBe('0.00');
    expect(formattedNumber('132' as any, 5)).toBe('0.00');
  });

  it('should handle exponential notation', () => {
    expect(formattedNumber(1e-8, 8)).toBe('0.00000001');
  });
});
