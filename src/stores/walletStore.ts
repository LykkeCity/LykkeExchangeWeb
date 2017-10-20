import {action, computed, observable, runInAction} from 'mobx';
import {RootStore} from '.';
import {WalletApi} from '../api';
import {WalletModel} from '../models';

export class WalletStore {
  readonly rootStore: RootStore;

  @observable wallets: WalletModel[] = [];
  @observable loading: boolean = true;

  constructor(rootStore: RootStore, private api?: WalletApi) {
    this.rootStore = rootStore;
  }

  @computed
  get walletsWithAssets() {
    return this.wallets.filter(w => w.balances.length > 0);
  }

  @computed
  get selectedWallet() {
    return this.wallets.find(w => w.selected);
  }

  createWallet = () => {
    const wallet = new WalletModel();
    this.addWallet(wallet);
    return wallet;
  };

  fetchWallets = async () => {
    const resp = await this.api!.fetchAll();
    const balances = await this.rootStore.balanceStore.fetchAll();
    runInAction(() => {
      this.wallets = resp.map((x: any) => new WalletModel(x, this));
      balances.forEach((dto: any) => {
        const wallet = this.wallets.find(w => w.id === dto.Id);
        if (!!wallet) {
          wallet.setBalances(dto.Balances);
        } else {
          const tradingWallet = new WalletModel(dto, this);
          tradingWallet.setBalances(dto.Balances);
          this.wallets.push(tradingWallet);
        }
      });
      this.loading = false;
    });
  };

  fetchWalletById = async (id: string) => {
    const dto = await this.api!.fetchById(id);
    const wallet = new WalletModel(dto, this);
    this.updateWallet(wallet);
    return wallet;
  };

  findWalletById = (id: string) => this.wallets.find(w => w.id === id);

  @action addWallet = (wallet: WalletModel) => this.wallets.unshift(wallet);

  @action
  updateWallet = (wallet: WalletModel) => {
    const idx = this.wallets.findIndex(w => w.id === wallet.id);
    this.wallets.splice(idx, 1, wallet);
  };

  createApiWallet = async (name: string) => {
    const resp = await this.api!.createApiWallet(name);
    const apiWallet = new WalletModel({...resp, Id: resp.WalletId, Name: name});
    this.addWallet(apiWallet);
    return apiWallet;
  };

  regenerateApiKey = async (wallet: WalletModel) => {
    const resp = await this.api!.regenerateApiKey(wallet.id);
    runInAction(() => (wallet.apiKey = resp.ApiKey));
  };

  convertToBaseCurrency = (convertable: {
    toAssetId: string;
    fromAssetId: string;
    amount: number;
    direction: 'Sell' | 'Buy';
  }) => this.api!.convertToBaseCurrency(convertable);
}

export default WalletStore;
