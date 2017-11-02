import {RestApi} from '.';
import {RootStore} from '../stores/index';
import {connectUrls} from '../utils/authUtils';
import {ApiResponse} from './types';

export interface ProfileApi {
  fetchBaseAsset: () => ApiResponse<any>;
  updateBaseAsset: (baseCurrency: string) => ApiResponse<any>;
  getUserName: (token: string) => ApiResponse<any>;
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

  getUserName = (token: string) => this.getAuth(connectUrls.info);
}

export default RestProfileApi;
