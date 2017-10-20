import {observable} from 'mobx';
import {TransferApi} from '../api/index';
import {TransferModel} from '../models/index';
import {RootStore} from './index';

export class TransferStore {
  readonly rootStore: RootStore;
  @observable transfers: TransferModel[] = [];

  constructor(rootStore: RootStore, private api: TransferApi) {
    this.rootStore = rootStore;
  }

  createTransfer = () => {
    const transfer = new TransferModel(this);
    this.addTransfer(transfer);
    return transfer;
  };

  addTransfer = (transfer: TransferModel) => this.transfers.unshift(transfer);

  transfer = async (transfer: TransferModel) => {
    await this.api.transfer(transfer);
    this.addTransfer(transfer);
  };
}

export default TransferStore;
