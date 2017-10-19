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
          const tradingWallet = new WalletModel(dto, this);
          tradingWallet.setBalances(dto.Balances);
          this.wallets.push(tradingWallet);
        }
      });
      this.loading = false;
    });
  };

  fetchById = async (id: string) => {
    const dto = await this.api!.fetchById(id);
    const wallet = new WalletModel(dto, this);
    this.replace(wallet);
    return wallet;
  };

  findById = (id: string) => this.wallets.find(w => w.id === id);

  @action add = (wallet: WalletModel) => this.wallets.unshift(wallet);

  @action
  replace = (wallet: WalletModel) => {
    const idx = this.wallets.findIndex(w => w.id === wallet.id);
    this.wallets.splice(idx, 1, wallet);
  };

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

  transfer = async (
    from: WalletModel,
    to: WalletModel,
    amount: number,
    asset: string
  ) => {
    const dto = JSON.stringify({
      AccountId: from.id,
      Amount: amount
    });
    // await this.api!.sendTransferNotification();
    return `//lykke-qr.azurewebsites.net/QR/${btoa(JSON.stringify(dto))}.gif`;
  };
}

export default WalletStore;
