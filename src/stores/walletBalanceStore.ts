import {action, observable, runInAction} from 'mobx';
import {BalanceApi} from '../api/index';
import {WalletModel} from '../models/index';
import {WalletBalanceModel} from '../models/walletBalanceModel';
import {RootStore} from './index';

export class WalletBalanceStore {
  readonly rootStore: RootStore;

  @observable balances: WalletBalanceModel[] = [];

  constructor(rootStore: RootStore, private api?: BalanceApi) {
    this.rootStore = rootStore;
  }

  @action
  updateFromServer = (json: any) => {
    let walletBalance = this.balances.find(w => w.id === json.Id);
    if (!walletBalance) {
      walletBalance = new WalletBalanceModel(this, json);
      this.balances.push(walletBalance);
    } else {
      walletBalance.updateFromJson(json);
    }

    return walletBalance;
  };

  clearBalancesAll = () => (this.balances = []);

  fetchAll = async () => await this.api!.fetchAll();

  fetchById = async (assetId: string) => {
    const balance = await this.api!.fetchById(assetId);
    this.updateFromServer(balance);
  };

  fetchForWallet = async (wallet: WalletModel) => {
    const balances = (await this.api!.fetchForWallet(
      wallet.id
    )) as WalletBalanceModel[];
    runInAction(() => {
      wallet.setBalances(balances);
    });
  };
}
