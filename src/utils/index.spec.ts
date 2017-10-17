import {plural} from '.';

test('plural should work correctly', () => {
  expect(plural(1, 'item')).toBe('item');
  expect(plural(2, 'item')).toBe('items');
  expect(plural(9392739273, 'item')).toBe('items');
  expect(plural(0, 'item')).toBe('items');
});
