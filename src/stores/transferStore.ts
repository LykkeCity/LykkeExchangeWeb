import {observable} from 'mobx';
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

  createTransfer = (addtoStore = true) => {
    const transfer = new TransferModel(this);
    transfer.from = this.rootStore.walletStore.createWallet();
    transfer.to = this.rootStore.walletStore.createWallet();
    if (addtoStore) {
      this.addTransfer(transfer);
    }
    return transfer;
  };

  addTransfer = (transfer: TransferModel) => this.transfers.unshift(transfer);

  transfer = async (transfer: TransferModel) => {
    await this.api.transfer(transfer);
    this.addTransfer(transfer);
  };

  fetchOperationDetails = (transfer: TransferModel) =>
    this.api.fetchOperationDetails(transfer);

  conversionIsRequired = (transferCurrency: string, baseCurrency: string) => {
    return transferCurrency !== baseCurrency;
  };

  convertToBaseCurrency = (transfer: TransferModel, baseCurrency: string) => {
    if (!this.conversionIsRequired(transfer.asset, baseCurrency)) {
      return {Converted: [{To: {Amount: transfer.amount}}]}; // todo: introduce model ?
    }

    const balance = this.rootStore.balanceStore.createBalance();
    balance.balance = transfer.amount;
    balance.assetId = transfer.asset;

    return this.converter!.convertToBaseAsset([balance], baseCurrency);
  };
}

export default TransferStore;
