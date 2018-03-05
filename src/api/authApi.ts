import {RestApi} from './index';
import {ApiResponse} from './types';

export interface AuthApi {
  fetchToken: (accessToken: string) => ApiResponse;
}

export class RestAuthApi extends RestApi implements AuthApi {
  fetchToken = (accessToken: string) =>
    this.authWretch
      .headers({
        Authorization: `Bearer ${accessToken}`,
        application_id: process.env.REACT_APP_CLIENT_ID
      })
      .url('/getlykkewallettoken')
      .get()
      .json();
}

export default RestAuthApi;
