import {CredentialsModel} from '../models';
import {RestApi} from './index';
import {ApiResponse} from './types';

export interface AuthApi {
  getToken: (credentials: CredentialsModel) => ApiResponse<any>;
}

export class RestAuthApi extends RestApi implements AuthApi {
  // TODO: To be removed
  getToken = (credentials: CredentialsModel) =>
    this.apiWretch
      .url('/client/auth')
      .content('application/json-patch+json')
      .json({
        ClientInfo: '',
        Email: credentials.email,
        PartnerId: '',
        Password: credentials.password
      })
      .post()
      .json();

  getSessionToken = (clientId: string, token: string) =>
    this.authBearerWretch()
      .headers({
        application_id: clientId
      })
      .url('/getlykkewallettoken')
      .get()
      .json();

  getBearerToken = (app: any, code: string, path: string) =>
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
