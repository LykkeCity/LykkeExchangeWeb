import {action, observable, runInAction} from 'mobx';
import {RootStore} from '.';
import {BalanceApi} from '../api/';
import {BalanceModel, WalletModel} from '../models/index';

export class BalanceStore {
  readonly rootStore: RootStore;

  @observable balances: any[];

  constructor(rootStore: RootStore, private api?: BalanceApi) {
    this.rootStore = rootStore;
  }

  createBalance = (dto?: any) => new BalanceModel(this, dto);

  @action
  updateFromServer = (json: any) => {
    const idx = this.balances.findIndex(x => x.id === json);
    this.balances[idx] = json;
  };

  fetchAll = async () => await this.api!.fetchAll();

  fetchById = async (assetId: string) => {
    const balance = await this.api!.fetchById(assetId);
    this.updateFromServer(balance);
  };

  fetchForWallet = async (wallet: WalletModel) => {
    const balances = (await this.api!.fetchForWallet(wallet.id)) as any[];
    runInAction(() => {
      wallet.setBalances(balances);
    });
  };
}

export default BalanceStore;
