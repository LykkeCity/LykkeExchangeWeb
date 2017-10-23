import {action, computed, observable} from 'mobx';
import {WalletModel} from '.';
import {TransferStore} from '../stores';

export class TransferModel {
  readonly store: TransferStore;

  @observable from: WalletModel;
  @observable to: WalletModel;
  @observable amount: number;
  @observable asset: string;

  @computed
  get asQr() {
    return !!this.from
      ? btoa(
          JSON.stringify({
            AccountId: this.from.id,
            Amount: this.amount
          })
        )
      : '';
  }

  constructor(store: TransferStore) {
    this.store = store;
  }

  @action
  update = (transfer: Partial<TransferModel>) => Object.assign(this, transfer);

  submit = async () => {
    // this.from.debit(this.amount);
    // this.to.credit(this.amount);
    await this.store.transfer(this);
  };
}

export default TransferModel;
