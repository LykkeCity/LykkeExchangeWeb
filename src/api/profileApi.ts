import {RestApi} from '.';
import {ApiResponse} from './types';

export interface ProfileApi {
  fetchBaseAsset: () => ApiResponse<any>;
  updateBaseAsset: (baseCurrency: string) => ApiResponse<any>;
  getUserInfo: () => ApiResponse<any>;
}

export class RestProfileApi extends RestApi implements ProfileApi {
  fetchBaseAsset = () => this.get('/assets/baseAsset');

  updateBaseAsset = (baseCurrency: string) =>
    this.apiBearerWretch()
      .url('/assets/baseAsset')
      .json({BaseAssetId: baseCurrency})
      .post()
      .unauthorized(this.rootStore.authStore.redirectToAuthServer)
      .res();

  getUserInfo = () =>
    this.apiBearerWretch()
      .url('/client/userInfo')
      .get()
      .unauthorized(this.rootStore.authStore.redirectToAuthServer)
      .json();
}

export default RestProfileApi;
