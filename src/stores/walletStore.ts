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
      this.wallets = resp.map((x: any) => new WalletModel(x));
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
}

export default WalletStore;
