import {observable, runInAction} from 'mobx';
import {RootStore} from '.';
import {BalanceApi} from '../api/';

export class BalanceStore {
  readonly rootStore: RootStore;

  @observable balances: any[];

  constructor(rootStore: RootStore, private api?: BalanceApi) {
    this.rootStore = rootStore;
  }

  fetchAll = async () => {
    const balances = await this.api!.fetchAll();
    runInAction(() => {
      this.balances = balances as any[];
    });
  };

  fetchById = async (assetId: string) => {
    const balance = await this.api!.fetchById(assetId);
    runInAction(() => {
      const idx = this.balances.findIndex(x => x.id === balance);
      this.balances[idx] = balance;
    });
  };
}

export default BalanceStore;
