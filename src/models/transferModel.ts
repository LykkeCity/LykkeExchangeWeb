import {action, observable, runInAction} from 'mobx';
import {WalletModel} from '.';

export class TransferModel {
  static blank = () =>
    new TransferModel(new WalletModel(), new WalletModel(), 0, '');
  @observable from: WalletModel;
  @observable to: WalletModel;
  @observable amount: number;
  @observable asset: string;
  @observable qr: string;

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
    const qr = await this.from.transfer(this);
    runInAction(() => (this.qr = qr));
  };
}

export default TransferModel;
