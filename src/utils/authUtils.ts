import wretch from 'wretch';

const AUTH_URL = 'https://auth-dev.lykkex.net';
const AUTH_SCOPE = 'profile email address';

const wretcher = wretch(AUTH_URL);

export const queryStringFromObject = (obj: any, path?: string) =>
  Object.keys(obj)
    .map(x => {
      let queryString = '';
      if (typeof obj[x] === 'object') {
        queryString += `${x}=${encodeURIComponent(
          queryStringFromObject(obj[x])
        )}`;
      } else {
        queryString += `${x}=${encodeURIComponent(obj[x])}`;
      }
      return queryString;
    })
    .join('&');

export const getConnectUrl = () => {
  const {client_id, redirect_uri} = app;
  const connectPath = `${authUrls.auth}?${queryStringFromObject({
    client_id,
    redirect_uri,
    response_type: 'code',
    scope: AUTH_SCOPE
  })}`;

  return `${AUTH_URL}/signin?returnurl=${encodeURIComponent(connectPath)}`;
};

export const getToken = async (code: string) =>
  await wretcher
    .url(authUrls.token)
    .formUrl({
      ...app,
      code,
      grant_type: 'authorization_code'
    })
    .post()
    .json();

// FIXME: get app config from external resource
export const app = {
  client_id: '673a8672-3f3c-4315-b33b-32e443b9ced0',
  client_secret: '95f51fc5-86aa-42f8-b152-b2c93f14b00b',
  redirect_uri: 'http://localhost:3000/auth'
};

export const authUrls = {
  auth: '/connect/authorize',
  info: '/connect/userinfo',
  logout: '/connect/logout',
  token: '/connect/token'
};
