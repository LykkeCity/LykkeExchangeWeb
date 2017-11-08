import {observable, runInAction} from 'mobx';
import {RootStore} from '.';
import {BalanceApi} from '../api/';
import {BalanceModel, WalletModel} from '../models/index';

export class BalanceStore {
  readonly rootStore: RootStore;

  @observable balances: any[] = [];

  constructor(rootStore: RootStore, private api?: BalanceApi) {
    this.rootStore = rootStore;
  }

  createBalance = (assetId?: string, balance?: number) =>
    new BalanceModel(this, {AssetId: assetId, Balance: balance});

  updateFromServer = (json: any) => new BalanceModel(this, json);

  fetchAll = async () => await this.api!.fetchAll();

  fetchById = async (assetId: string) => {
    const balance = await this.api!.fetchById(assetId);
    runInAction(() => {
      const idx = this.balances.findIndex(x => x.id === balance);
      this.balances[idx] = balance;
    });
  };

  fetchForWallet = async (wallet: WalletModel) => {
    const balances = (await this.api!.fetchForWallet(wallet.id)) as any[];
    runInAction(() => {
      wallet.setBalances(balances);
    });
  };
}

export default BalanceStore;
