import {RestApi} from '.';
import {ApiResponse} from './types';

export interface WalletApi {
  fetchAll: () => ApiResponse<any[]>;
}

export class RestWalletApi extends RestApi implements WalletApi {
  fetchAll = () =>
    this.bearerWretch()
      .url('/client/wallets/')
      .get()
      .json<any[]>();

  fetchBalanceById = (id: string) =>
    this.bearerWretch()
      .url(`/client/wallet/${id}/balances`)
      .get();
}

export default RestWalletApi;
