import {RestApi} from '.';
import {ApiResponse} from './types';

export interface AppSettingsApi {
  fetchSettings: () => ApiResponse<any>;
  fetchCountryCodes: () => ApiResponse<any>;
}

export class RestAppSettingsApi extends RestApi implements AppSettingsApi {
  fetchSettings = () =>
    this.get('/AppSetting').catch(
      this.rootStore.authStore.redirectToAuthServer
    );
  fetchCountryCodes = () =>
    this.get('/Catalogs').catch(this.rootStore.authStore.redirectToAuthServer);
}

export default RestAppSettingsApi;
