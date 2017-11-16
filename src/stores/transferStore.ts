import {action, observable} from 'mobx';
import {RootStore} from '.';
import {ConverterApi} from '../api/converterApi';
import {TransferApi} from '../api/transferApi';
import {TransferModel} from '../models';

export class TransferStore {
  @observable transfers: TransferModel[] = [];
  @observable newTransfer: TransferModel;

  constructor(
    readonly rootStore: RootStore,
    private api: TransferApi,
    private converter: ConverterApi
  ) {
    this.newTransfer = this.createTransfer(false);
  }

  @action
  createTransfer = (addtoStore = true) => {
    const transfer = new TransferModel(this);
    if (addtoStore) {
      this.addTransfer(transfer);
    }
    return transfer;
  };

  @action
  addTransfer = (transfer: TransferModel) => this.transfers.unshift(transfer);

  @action
  resetCurrentTransfer = () => {
    this.newTransfer = this.createTransfer(false);
  };

  @action
  startTransfer = (transfer: TransferModel) => this.api.startTransfer(transfer);

  finishTransfer = (transfer: TransferModel) => {
    const {amount, asset, from: sourceWallet, to: destWallet} = transfer;
    sourceWallet.withdraw(amount, asset);
    destWallet.deposit(amount, asset);
    this.addTransfer(transfer);
    this.resetCurrentTransfer();
  };

  cancelTransfer = (transfer: TransferModel) =>
    this.api.cancelTransfer(transfer);

  fetchOperationDetails = (transfer: TransferModel) =>
    this.api.fetchOperationDetails(transfer);

  conversionIsRequired = (transferCurrency: string, baseCurrency: string) => {
    return transferCurrency !== baseCurrency;
  };

  convertToBaseCurrency = (transfer: TransferModel, baseCurrency: string) => {
    if (!this.conversionIsRequired(transfer.asset.id, baseCurrency)) {
      return {Converted: [{To: {Amount: transfer.amount}}]};
    }

    const balance = this.rootStore.balanceStore.createBalance();
    balance.balance = transfer.amount;
    balance.assetId = transfer.asset.id;

    return this.converter!.convertToBaseAsset([balance], baseCurrency);
  };
}

export default TransferStore;
