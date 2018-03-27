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

export const getOAuthParamFromUrl = (url: string, key: string) => {
  const value = new URL(url).hash
    .split('&')
    .find(param => !!param.match(new RegExp(`^${key}`)));

  return value && value.split('=')[1];
};
