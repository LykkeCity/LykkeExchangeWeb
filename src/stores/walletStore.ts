import {observable, runInAction} from 'mobx';
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

  createApiWallet = async (name: string) => {
    const resp = await this.api!.createApiWallet(name);
    const apiWallet = new WalletModel({...resp, Id: resp.WalletId});
    runInAction(() => this.wallets.push(apiWallet));
    return apiWallet;
  };

  convertToBaseCurrency = (convertable: {
    toAssetId: string;
    fromAssetId: string;
    volume: number;
    direction: 'Sell' | 'Buy';
  }) => this.api!.convertToBaseCurrency(convertable);
}

export default WalletStore;
