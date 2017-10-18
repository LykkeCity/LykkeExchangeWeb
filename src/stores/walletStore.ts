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

  fetchAll = async () => {
    const resp = await this.api!.fetchAll();
    const balances = await this.rootStore.balanceStore.fetchAll();
    runInAction(() => {
      this.wallets = resp.map((x: any) => new WalletModel(x, this));
      balances.forEach((dto: any) => {
        const wallet = this.wallets.find(w => w.id === dto.Id);
        if (!!wallet) {
          wallet.setBalances(dto.Balances);
        } else {
          const tradingWallet = new WalletModel(dto);
          tradingWallet.setBalances(dto.Balances);
          this.wallets.push(tradingWallet);
        }
      });
      this.loading = false;
    });
  };

  @action add = (wallet: WalletModel) => this.wallets.unshift(wallet);

  createApiWallet = async (name: string) => {
    const resp = await this.api!.createApiWallet(name);
    const apiWallet = new WalletModel({...resp, Id: resp.WalletId, Name: name});
    this.add(apiWallet);
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

  transfer = (
    from: WalletModel,
    to: WalletModel,
    amount: number,
    asset: string
  ) => this.api!.transfer(from.id, to.id, amount, asset);
}

export default WalletStore;
