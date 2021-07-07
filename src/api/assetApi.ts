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
  fetchPaymentMethods: () => ApiResponse<any>;
  fetchWithdrawMethods: () => ApiResponse<any>;
  fetchAvailableCryptoOperations: () => ApiResponse<any>;
}

export class RestAssetApi extends RestApi implements AssetApi {
  fetchAssets = () => this.get('/assets');
  fetchAvailableAssets = () => this.get('/assets/available');
  fetchAssetInstruments = () => this.get('/assetpairs');
  fetchRates = () => this.get('/markets');
  fetchAssetAddress = (id: string) =>
    this.get(`/deposits/crypto/${id}/address`);
  generateAssetAddress = (id: string) =>
    this.post(`/deposits/crypto/${id}/address`);

  fetchCategories = () => this.get('/assets/categories');

  fetchPaymentMethods = () => this.get('/paymentmethods');
  fetchWithdrawMethods = () => this.get('/withdrawals/available');
  fetchAvailableCryptoOperations = () =>
    this.get('/assets/available/crypto-operations');
}

export default RestAssetApi;
