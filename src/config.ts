export const config = {
  common: {
    appStoreLink: 'https://appsto.re/ru/Dwjvcb.i',
    googlePlayLink:
      'https://play.google.com/store/apps/details?id=com.lykkex.LykkeWallet'
  },

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
  },

  baseApi: {
    url: process.env.REACT_APP_API_URL
  }
};
