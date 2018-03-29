import {getOAuthParamFromUrl, queryStringFromObject} from './authUtils';

test('queryStringFromObject', () => {
  // tslint:disable-next-line:variable-name
  const client_id = 'client_id';
  // tslint:disable-next-line:variable-name
  const redirect_uri = 'redirect_uri';
  const query = queryStringFromObject({
    client_id,
    redirect_uri,
    response_type: 'code',
    scope: 'scope'
  });
  const returnUrl = encodeURIComponent(
    `/connect/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=scope`
  );
  expect(`returnurl=${encodeURIComponent(`/connect/authorize?${query}`)}`).toBe(
    `returnurl=${returnUrl}`
  );

  expect(queryStringFromObject({foo: 'bar'})).toBe('foo=bar');
  expect(queryStringFromObject({foo: {foo: 'bar'}})).toBe('foo=foo%3Dbar');
});

test('getOAuthParamFromUrl', () => {
  let url =
    'http://localhost:3000/auth#state=foo&scope=email%20profile&token_type=Bearer&access_token=bar&expires_in=3600';

  expect(getOAuthParamFromUrl(url, 'state')).toBe('foo');
  expect(getOAuthParamFromUrl(url, 'access_token')).toBe('bar');

  url =
    'http://localhost:3000/auth#new_param=123&state=foo&scope=email%20profile&token_type=Bearer&access_token=bar&expires_in=3600';

  expect(getOAuthParamFromUrl(url, 'state')).toBe('foo');
  expect(getOAuthParamFromUrl(url, 'access_token')).toBe('bar');
});
