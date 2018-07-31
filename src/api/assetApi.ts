import {RestApi} from './index';
import {ApiResponse} from './types/index';

export interface AssetApi {
  fetchAssets: () => ApiResponse<any>;
  fetchAvailableAssets: () => ApiResponse<any>;
  fetchAssetInstruments: () => ApiResponse<any>;
  fetchAssetAddress: (id: string) => ApiResponse<any>;
  generateAssetAddress: (id: string) => ApiResponse<any>;
  fetchRates: () => ApiResponse<any>;
  fetchCategories: () => ApiResponse<any>;
  fetchDescription: () => ApiResponse<any>;
  fetchPaymentMethods: () => ApiResponse<any>;
}

export class RestAssetApi extends RestApi implements AssetApi {
  fetchAssets = () => this.get('/assets');
  fetchAvailableAssets = () => this.get('/assets/available');
  fetchAssetInstruments = () => this.get('/assetpairs');
  fetchRates = () => this.get('/markets');
  fetchAssetAddress = (id: string) =>
    this.get(`/deposits/crypto/${id}/address`);
  generateAssetAddress = (id: string) =>
    this.post(`/deposits/crypto/${id}/address`, undefined);

  fetchCategories = () => this.get('/assets/categories');

  fetchDescription = () => this.get('/assets/description');
  fetchPaymentMethods = () => this.get('/paymentmethods');
}

export default RestAssetApi;
