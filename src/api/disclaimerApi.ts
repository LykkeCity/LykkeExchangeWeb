import {RestApiV1} from './index';
import {ApiResponse} from './types/index';

export interface DisclaimerApi {
  fetchAssetDisclaimers: () => ApiResponse<any>;
  approveAssetDisclaimer: (disclaimerId: string) => ApiResponse<any>;
  declineAssetDisclaimer: (disclaimerId: string) => ApiResponse<any>;
}

export class RestDisclaimerApi extends RestApiV1 implements DisclaimerApi {
  fetchAssetDisclaimers = () => this.get('/AssetDisclaimers');
  approveAssetDisclaimer = (disclaimerId: string) =>
    this.post(`/AssetDisclaimers/${disclaimerId}/approve`);
  declineAssetDisclaimer = (disclaimerId: string) =>
    this.post(`/AssetDisclaimers/${disclaimerId}/decline`);
}

export default RestDisclaimerApi;
