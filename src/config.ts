export const config = {
  auth: {
    client_id: process.env.REACT_APP_CLIENT_ID,
    client_secret: process.env.REACT_APP_CLIENT_SECRET,
    redirect_uri: `${location.protocol}//${location.host}/auth`,
    scope: 'profile email address',
    url: process.env.REACT_APP_AUTH_URL,

    apiUrls: {
      auth: '/connect/authorize',
      info: '/connect/userinfo',
      logout: '/connect/logout',
      token: '/connect/token'
    }
  }
};
