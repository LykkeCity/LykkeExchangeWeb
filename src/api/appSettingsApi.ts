import {RestApi} from '.';
import {ApiResponse} from './types';

export interface AppSettingsApi {
  fetchFeePercentage: () => ApiResponse<any>;
  fetchCountryCodes: () => ApiResponse<any>;
}

export class RestAppSettingsApi extends RestApi implements AppSettingsApi {
  fetchFeePercentage = () =>
    this.get('/FeeSetting').catch(
      this.rootStore.authStore.redirectToAuthServer
    );

  fetchCountryCodes = () =>
    this.get('/Catalogs').catch(this.rootStore.authStore.redirectToAuthServer);
}

export default RestAppSettingsApi;
