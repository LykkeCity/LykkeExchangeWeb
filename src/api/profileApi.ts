import {RestApi} from '.';
import {config} from '../config';
import {RootStore} from '../stores/index';
import {ApiResponse} from './types';

export interface ProfileApi {
  fetchBaseAsset: () => ApiResponse<any>;
  updateBaseAsset: (baseCurrency: string) => ApiResponse<any>;
  getUserName: (token: string, cb?: any) => ApiResponse<any>;
}

export class RestProfileApi extends RestApi implements ProfileApi {
  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  fetchBaseAsset = () => this.get('/assets/baseAsset');

  updateBaseAsset = (baseCurrency: string) =>
    this.apiBearerWretch()
      .url('/assets/baseAsset')
      .json({BaseAsssetId: baseCurrency})
      .post();

  getUserName = (token: string, cb?: any) =>
    this.authBearerWretch()
      .url(config.auth.apiUrls.info)
      .get()
      .badRequest(cb)
      .json();
}

export default RestProfileApi;
