import {RestApi} from '.';
import {WalletModel} from '../models/index';
import {RootStore} from '../stores/index';
import {ApiResponse} from './types';

export interface WalletApi {
  fetchAll: () => ApiResponse<any>;
}

export class RestWalletApi extends RestApi implements WalletApi {
  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  fetchAll = () => this.get('/wallets/');

  fetchById = (id: string) => this.get(`/wallets/${id}`);

  fetchBalanceById = (id: string) => this.get(`/wallet/${id}/balances`);

  create = (name: string, type: string) =>
    this.post('/wallets', {Name: name, Type: type});

  createApiWallet = (name: string, desc?: string) =>
    this.post('/wallets/hft', {Name: name, Description: desc});

  regenerateApiKey = (id: string) =>
    this.put(`/hft/${id}/regenerateKey`, undefined);

  updateWallet = (wallet: WalletModel) =>
    this.put(`/wallets/${wallet.id}`, {
      Description: wallet.desc,
      Name: wallet.title
    });
}

export default RestWalletApi;
