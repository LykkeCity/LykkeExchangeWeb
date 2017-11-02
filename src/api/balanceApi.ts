import {RestApi} from '.';
import {ApiResponse} from './types';

export interface BalanceApi {
  fetchAll: () => ApiResponse<any>;
  fetchById: (assetId: string) => ApiResponse<any>;
}

export class RestBalanceApi extends RestApi implements BalanceApi {
  fetchAll = () => this.get('/wallets/balances');

  fetchById = (assetId: string) => this.get('/wallets/balances/${assetId}');

  fetchForWallet = (walletId: string) =>
    this.get(`/wallets/${walletId}/balances/`);
}

export default RestBalanceApi;
