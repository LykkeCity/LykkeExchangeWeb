import {observable} from 'mobx';
import {RootStore} from '.';
import {ConverterApi, TransferApi} from '../api';
import {TransferModel} from '../models';

export class TransferStore {
  readonly rootStore: RootStore;
  @observable transfers: TransferModel[] = [];

  constructor(
    rootStore: RootStore,
    private api: TransferApi,
    private converter: ConverterApi
  ) {
    this.rootStore = rootStore;
  }

  createTransfer = () => {
    const transfer = new TransferModel(this);
    transfer.from = this.rootStore.walletStore.createWallet();
    transfer.to = this.rootStore.walletStore.createWallet();
    this.addTransfer(transfer);
    return transfer;
  };

  addTransfer = (transfer: TransferModel) => this.transfers.unshift(transfer);

  transfer = async (transfer: TransferModel) => {
    await this.api.transfer(transfer);
    this.addTransfer(transfer);
  };

  convertToBaseCurrency = (transfer: TransferModel, baseCurrency: string) => {
    const conversionIsRequired = transfer.asset !== baseCurrency;

    if (!conversionIsRequired) {
      return {Converted: [{To: {Amount: transfer.amount}}]}; // todo: introduce model ?
    }

    const balance = this.rootStore.balanceStore.createBalance();
    balance.balance = transfer.amount;
    balance.assetId = transfer.asset;

    return this.converter!.convertToBaseAsset([balance], baseCurrency);
  };
}

export default TransferStore;
