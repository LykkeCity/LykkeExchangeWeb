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
    runInAction(() => {
      this.wallets = resp.map((x: any) => new WalletModel(x));
      this.wallets.forEach(async x => {
        await this.api!.fetchBalanceById(x.id).res(res => {
          if (res.status === 204) {
            x.setBalances([]);
          } else if (res.status === 200) {
            res.json().then((dto: any) => {
              x.setBalances(dto);
            });
          }
        });
      });
      this.loading = false;
    });
  };
}

export default WalletStore;
