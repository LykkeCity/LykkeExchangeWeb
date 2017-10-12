import {Credentials} from '../models/structs';
import {RestApi} from './index';
import {ApiResponse} from './types';

export interface AuthApi {
  getToken: (credentials: Credentials) => ApiResponse<any>;
}

export class RestAuthApi extends RestApi implements AuthApi {
  getToken = (credentials: Credentials) =>
    this.baseWretch
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
}

export default RestAuthApi;
