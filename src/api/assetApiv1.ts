import {RestApiv1} from './index';
import {ApiResponse} from './types/index';

export interface AssetApiv1 {
  generateAssetAddress: (id: string) => ApiResponse<any>;
}

export class RestAssetApiv1 extends RestApiv1 implements AssetApiv1 {
  generateAssetAddress = (id: string) =>
    this.apiBearerWretch()
      .url('/wallets')
      .json({AssetId: id})
      .post()
      .unauthorized(this.rootStore.authStore.redirectToAuthServer)
      .json();
}

export default RestAssetApiv1;
