import {RestApi} from '.';
import {connectUrls} from '../utils/authUtils';
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
      .url(connectUrls.info)
      .headers({
        Authorization: `Bearer ${token}`
      })
      .get()
      .json();
}

export default RestProfileApi;
