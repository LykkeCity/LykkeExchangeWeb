export const AUTH_URL = 'https://auth-dev.lykkex.net';

export const buildConnectUrl = () => {
  const returnUrl = encodeURIComponent(
    `${authUrls.auth}?client_id=${app.clientId}&redirect_uri=${app.redirectUrl}&response_type=${app.responseType}&scope=${app.scope}`
  );
  return `${AUTH_URL}/signin?returnurl=${returnUrl}`;
};

export const getToken = (code: string) =>
  fetch(`${AUTH_URL}${authUrls.token}`, {
    body: `code=${code}&client_id=${app.clientId}&client_secret=${app.secret}&grant_type=authorization_code&redirect_uri=${app.redirectUrl}`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST'
  }).then(resp => resp.json());

export const app = {
  clientId: '673a8672-3f3c-4315-b33b-32e443b9ced0',
  redirectUrl: 'http://localhost:3000/auth',
  responseType: 'code',
  scope: 'profile email address',
  secret: '95f51fc5-86aa-42f8-b152-b2c93f14b00b'
};

export const authUrls = {
  auth: '/connect/authorize',
  info: '/connect/userinfo',
  logout: '/connect/logout',
  token: '/connect/token'
};
