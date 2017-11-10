import {action, observable} from 'mobx';
import {WalletBalanceStore} from '../stores/walletBalanceStore';
import {nextId} from '../utils/index';
import {BalanceModel, WalletType} from './index';

export class WalletBalanceModel {
  id: string;
  title: string;
  type: WalletType;
  @observable balances: BalanceModel[];

  constructor(
    private readonly store: WalletBalanceStore,
    walletBalance?: Partial<WalletBalanceModel>
  ) {
    if (!!walletBalance) {
      this.id = walletBalance.id || String(nextId());
      Object.assign(this, walletBalance);
    }
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
