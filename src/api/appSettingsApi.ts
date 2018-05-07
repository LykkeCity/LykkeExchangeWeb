import {RestApi} from '.';
import {ApiResponse} from './types';

export interface AppSettingsApi {
  fetchSettings: () => ApiResponse<any>;
  fetchFeePercentage: () => ApiResponse<any>;
  fetchCountryCodes: () => ApiResponse<any>;
}

export class RestAppSettingsApi extends RestApi implements AppSettingsApi {
  fetchSettings = () =>
    this.get('/AppSetting').catch(
      this.rootStore.authStore.redirectToAuthServer
    );

  fetchFeePercentage = () =>
    this.get('/FeeSetting').catch(
      this.rootStore.authStore.redirectToAuthServer
    );

  fetchCountryCodes = () =>
    this.get('/Catalogs').catch(this.rootStore.authStore.redirectToAuthServer);
}

export default RestAppSettingsApi;
