import {RestApi} from './index';
import {ApiResponse} from './types';

export interface AuthApi {
  fetchSessionToken: (clientId: string, token: string) => ApiResponse;
  fetchBearerToken: (app: any, code: string, path: string) => ApiResponse;
}

export class RestAuthApi extends RestApi implements AuthApi {
  login = (username: string, password: string) =>
    this.apiWretch
      .url('/client/auth')
      .json({
        Email: username,
        Password: password
      })
      .post()
      .json();

  fetchSessionToken = (clientId: string, token: string) =>
    this.authBearerWretch()
      .headers({
        application_id: clientId
      })
      .url('/getlykkewallettoken')
      .get()
      .json();

  fetchBearerToken = (app: any, code: string, path: string) =>
    this.authWretch
      .url(path)
      .formUrl({
        code,
        grant_type: 'authorization_code',
        ...app
      })
      .post()
      .json();

  signOut = (path: string, token: string) => this.postAuth(path, {});
}

export default RestAuthApi;
