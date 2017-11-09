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
    transfer.from = this.rootStore.walletStore.createWallet();
    transfer.to = this.rootStore.walletStore.createWallet();
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

  cancelTransfer = async (transfer: TransferModel) => {
    await this.api.cancelTransfer(transfer);
  };

  fetchOperationDetails = (transfer: TransferModel) =>
    this.api.fetchOperationDetails(transfer);

  conversionIsRequired = (transferCurrency: string, baseCurrency: string) => {
    return transferCurrency !== baseCurrency;
  };

  convertToBaseCurrency = async (
    transfer: TransferModel,
    baseCurrency: string
  ) => {
    if (!this.conversionIsRequired(transfer.asset, baseCurrency)) {
      transfer.amountInBaseCurrency = transfer.amount;
      return transfer;
    }

    const balance = this.rootStore.balanceStore.createBalance(
      transfer.asset,
      transfer.amount
    );

    return transfer.updateFromJson(
      await this.converter!.convertToBaseAsset([balance], baseCurrency)
    );
  };
}

export default TransferStore;
