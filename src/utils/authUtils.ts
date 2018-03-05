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

export const getAccessTokenFromUrl = (url: string) =>
  new URL(url).hash.split('&')[3].split('=')[1];

export const getStateFromUrl = (url: string) =>
  new URL(url).hash.split('&')[0].split('=')[1];
