import {RestApi} from '.';
import {RootStore} from '../stores/index';
import {ApiResponse} from './types';

export interface ProfileApi {
  fetchBaseAsset: () => ApiResponse<any>;
  updateBaseAsset: (baseCurrency: string) => ApiResponse<any>;
  getUserName: () => ApiResponse<any>;
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

  getUserName = () =>
    this.apiBearerWretch()
      .url('/client/userInfo')
      .get()
      .json();
}

export default RestProfileApi;
