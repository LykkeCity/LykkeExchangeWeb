import {observable, runInAction} from 'mobx';
import {RootStore} from '.';
import {WalletApi} from '../api';
import {WalletModel} from '../models';

export class WalletStore {
  readonly rootStore: RootStore;

  @observable wallets: WalletModel[] = [];

  constructor(rootStore: RootStore, private api?: WalletApi) {
    this.rootStore = rootStore;
  }

  fetchAll = async () => {
    const resp = await this.api!.fetchAll();
    runInAction(() => {
      this.wallets = resp.map((x: any) => new WalletModel(x));
      this.wallets.forEach(async x => {
        let balance = 0;
        await this.api!.fetchBalanceById(x.id).res(res => {
          if (res.status === 204) {
            balance = 0;
          } else if (res.status === 200) {
            res.json().then((dto: any) => {
              x.figures.total = dto[0].Balance;
            });
          }
        });
      });
    });
  };
}

export default WalletStore;
