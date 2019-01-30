import {RestApiV1} from './index';
import {ApiResponse} from './types/index';

export interface ResourceApi {
  fetchAssetIcons: () => ApiResponse<any>;
}

export class RestResourceApi extends RestApiV1 implements ResourceApi {
  fetchAssetIcons = () => this.get('/resources/group/assetsDetails/section');
}

export default RestResourceApi;
