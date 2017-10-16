export const queryStringFromObject = (obj: any, path?: string) =>
  Object.keys(obj)
    .map(x => {
      let queryString = '';
      if (typeof obj[x] === 'object') {
        queryString += `${x}=${encodeURIComponent(
          queryStringFromObject(obj[x])
        )}`;
      } else {
        queryString += `${x}=${obj[x]}`;
      }
      return queryString;
    })
    .join('&');

export const AUTH_SCOPE = 'profile email address';

export const app = {
  client_id: '36b620b5-94a6-4469-a150-082485b21bee',
  client_secret: process.env.REACT_APP_CLIENT_SECRET,
  redirect_uri: `//${location.host}/auth`
};

export const connectUrls = {
  auth: '/connect/authorize',
  info: '/connect/userinfo',
  logout: '/connect/logout',
  token: '/connect/token'
};
