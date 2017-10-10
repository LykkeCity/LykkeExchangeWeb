const TOKEN_KEY = 'lww-token';

const storage = window.localStorage;

export const set = (value: any) => storage.setItem(TOKEN_KEY, value);

export const get = () => storage.getItem(TOKEN_KEY);

export const clear = () => storage.removeItem(TOKEN_KEY);
