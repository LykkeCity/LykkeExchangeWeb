import {LocalStorageMock} from './testUtils';

const TOKEN_KEY = 'lww-token';

const storage = window.localStorage || new LocalStorageMock();

export const set = (value: any) =>
  storage.setItem(TOKEN_KEY, JSON.stringify(value));

export const get = () => JSON.parse(storage.getItem(TOKEN_KEY)!);

export const clear = () => storage.removeItem(TOKEN_KEY);
