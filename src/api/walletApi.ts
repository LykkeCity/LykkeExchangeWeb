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

  create = (name: string, type: string) =>
    this.bearerWretch()
      .url('/client/wallet')
      .json({Name: name, Type: type})
      .post()
      .json();

  createApiWallet = (name: string) =>
    this.bearerWretch()
      .url('/hft/key')
      .json({Name: name})
      .post()
      .json();

  convertToBaseCurrency = (convertable: any) =>
    this.baseWretch
      .url('/Market/converter')
      .json(convertable)
      .post()
      .json();
}

export default RestWalletApi;
