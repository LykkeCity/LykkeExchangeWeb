import {RestApi} from '.';
import {ApiResponse} from './types';

export interface WalletApi {
  fetchAll: () => ApiResponse<any[]>;
}

export class RestWalletApi extends RestApi implements WalletApi {
  fetchAll = () =>
    this.bearerWretch()
      .url('/wallets/')
      .get()
      .json<any[]>();

  fetchById = (id: string) =>
    this.bearerWretch()
      .url(`/wallets/${id}`)
      .get()
      .json<any[]>();

  fetchBalanceById = (id: string) =>
    this.bearerWretch()
      .url(`/wallet/${id}/balances`)
      .get();

  create = (name: string, type: string) =>
    this.bearerWretch()
      .url('/wallets')
      .json({Name: name, Type: type})
      .post()
      .json();

  createApiWallet = (name: string) =>
    this.bearerWretch()
      .url('/wallets/hft')
      .json({Name: name})
      .post()
      .json();

  regenerateApiKey = (id: string) =>
    this.bearerWretch()
      .url(`/Hft/${id}/regenerateKey`)
      .put()
      .json();

  convertToBaseCurrency = (convertable: any) =>
    this.baseWretch
      .url('/market/converter')
      .json(convertable)
      .post()
      .json();
}

export default RestWalletApi;
