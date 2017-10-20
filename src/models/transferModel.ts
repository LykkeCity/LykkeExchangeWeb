import {action, computed, observable} from 'mobx';
import {WalletModel} from '.';

export class TransferModel {
  static empty = () =>
    new TransferModel(new WalletModel(), new WalletModel(), 0, '');
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

  constructor(
    from: WalletModel,
    to: WalletModel,
    amount: number,
    asset: string
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
    await this.from.transfer(this);
  };
}

export default TransferModel;
