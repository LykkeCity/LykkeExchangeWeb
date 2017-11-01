const TOKEN_KEY = 'lww-token';
const AUTH_TOKEN_KEY = 'lww-oauth';

const storage = window.localStorage;

const getItem = (key: string) => () => storage.getItem(key);
const setItem = (key: string) => (value: any) => storage.setItem(key, value);
const removeItem = (key: string) => () => storage.removeItem(key);

export const setSessionToken = setItem(TOKEN_KEY);

export const getSessionToken = getItem(TOKEN_KEY);

export const clearSessionToken = removeItem(TOKEN_KEY);

export const setAccessToken = setItem(AUTH_TOKEN_KEY);

export const getAccessToken = () => {
  const item = getItem(AUTH_TOKEN_KEY)();
  return item ? JSON.parse(item).access_token : '';
};

export const clearAccessToken = removeItem(AUTH_TOKEN_KEY);
