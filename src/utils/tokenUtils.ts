const TOKEN_KEY = 'lww-token';

export const set = (value: any) =>
  localStorage.setItem(TOKEN_KEY, JSON.stringify(value));

export const get = () => JSON.parse(localStorage.getItem(TOKEN_KEY)!);

export const clear = () => localStorage.removeItem(TOKEN_KEY);
