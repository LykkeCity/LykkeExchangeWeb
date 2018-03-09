import {RestApiv1} from '.';
import {ApiResponse} from './types';

export interface AppSettingsApi {
  fetchSettings: () => ApiResponse<any>;
  fetchCountryCodes: () => ApiResponse<any>;
}

export class RestAppSettingsApi extends RestApiv1 implements AppSettingsApi {
  fetchSettings = () => this.get('/AppSettings');
  fetchCountryCodes = () => this.get('/CountryPhoneCodes');
}

export default RestAppSettingsApi;
