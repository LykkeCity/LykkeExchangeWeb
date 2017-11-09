import {action, observable} from 'mobx';
import {WalletBalanceStore} from '../stores/walletBalanceStore';
import {BalanceModel, WalletType} from './index';

export class WalletBalanceModel {
  id: string;
  title: string;
  type: WalletType;
  @observable balances: BalanceModel[];

  private readonly store: WalletBalanceStore;

  constructor(store: WalletBalanceStore, json?: any) {
    this.store = store;
    this.updateFromJson(json);
  }

  @action
  updateFromJson = (json: any) => {
    if (!!json) {
      this.id = json.Id;
      this.title = json.Name;
      this.type = json.Type;
      if (!!json.Balances) {
        this.setBalances(json.Balances);
      }
    }
  };

  @action
  setBalances = (dto: any[]) => {
    const {updateFromServer} = this.store.rootStore.balanceStore;
    this.balances = dto.map(updateFromServer);
  };
}
