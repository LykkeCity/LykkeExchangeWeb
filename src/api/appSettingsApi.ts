import {RestApiv1} from '.';
import {ApiResponse} from './types';

export interface AppSettingsApi {
  fetchSettings: () => ApiResponse<any>;
  fetchCountryCodes: () => ApiResponse<any>;
}

export class RestAppSettingsApi extends RestApiv1 implements AppSettingsApi {
  fetchSettings = () => this.get('/feeSetting');
  fetchCountryCodes = () => this.get('/catalogs');
}

export default RestAppSettingsApi;
