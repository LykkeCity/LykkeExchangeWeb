import {action, computed, observable} from 'mobx';
import {WalletModel} from '.';
import {TransferStore} from '../stores';

export class TransferModel {
  static empty = (store: TransferStore) =>
    new TransferModel(new WalletModel(), new WalletModel(), 0, '', store);

  static create = (
    from: WalletModel,
    to: WalletModel,
    amount: number,
    asset: string,
    store: TransferStore
  ) => new TransferModel(from, to, amount, asset, store);

  @observable from: WalletModel;
  @observable to: WalletModel;
  @observable amount: number;
  @observable asset: string;

  @computed
  get qr() {
    const dto = {
      AccountId: this.from.id,
      Amount: this.amount
    };
    return btoa(JSON.stringify(dto));
  }

  protected constructor(
    from: WalletModel,
    to: WalletModel,
    amount: number,
    asset: string,
    private store: TransferStore
  ) {
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.asset = asset;
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
