import {RestApi} from '.';
import {ApiResponse} from './types';

export interface ProfileApi {
  fetchBaseCurrency: () => ApiResponse<any>;
  updateBaseCurrency: (baseCurrency: string) => ApiResponse<any>;
  getUserName: (token: string) => ApiResponse<any>;
}

export class RestProfileApi extends RestApi implements ProfileApi {
  fetchBaseCurrency = () =>
    this.bearerWretch()
      .get('/baseCurrency')
      .json();

  updateBaseCurrency = (baseCurrency: string) =>
    this.bearerWretch()
      .json({baseCurrency}) // TODO: adjust data contract
      .post('/baseCurrency');

  getUserName = (token: string) =>
    this.authWretch
      .url('/connect/userinfo')
      .headers({
        Authorization: `Bearer ${token}`
      })
      .get()
      .json();
}

export default RestProfileApi;
