import {RestApi} from './index';
import {ApiResponse} from './types/index';

export interface AssetApi {
  fetchAssets: () => ApiResponse<any>;
  fetchCategories: () => ApiResponse<any>;
  fetchDescription: () => ApiResponse<any>;
}

export class RestAssetApi extends RestApi implements AssetApi {
  fetchAssets = () => this.get('/assets');

  fetchCategories = () => this.get('/assets/categories');

  fetchDescription = () => this.get('/assets/description');
}

export default RestAssetApi;
