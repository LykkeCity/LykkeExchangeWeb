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
    const dto = {
      AccountId: this.from.id,
      Amount: this.amount
    };
    return btoa(JSON.stringify(dto));
  }

  constructor(store: TransferStore) {
    this.store = store;
    this.from = this.store.rootStore.walletStore.createWallet();
    this.to = this.store.rootStore.walletStore.createWallet();
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
