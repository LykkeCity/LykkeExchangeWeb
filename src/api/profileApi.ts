import {RestApi} from '.';
import {ApiResponse} from './types';

export interface ProfileApi {
  fetchBaseAsset: () => ApiResponse<any>;
  updateBaseAsset: (baseCurrency: string) => ApiResponse<any>;
  getUserInfo: () => ApiResponse<any>;
  get2faStatus: () => ApiResponse<any>;
  get2faCode: () => ApiResponse<any>;
  sendSmsCode: () => ApiResponse<any>;
  verifySmsCode: (tfaCode: string, smsCode: string) => ApiResponse<any>;
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

  get2faStatus = () => this.get('/2fa');

  get2faCode = () => this.get('/2fa/setup/google');

  sendSmsCode = () => this.post('/2fa/setup/google/confirmRequest');

  verifySmsCode = (tfaCode: string, smsCode: string) =>
    this.post('/2fa/setup/google', {
      Code: smsCode,
      GaCode: tfaCode
    });
}

export default RestProfileApi;
