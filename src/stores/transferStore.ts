import {action, observable} from 'mobx';
import {RootStore} from '.';
import {LkkInvestmentApi} from '../api/lkkInvestmentApi';
import {TransferApi} from '../api/transferApi';
import {LkkInvestmentModel, TransferModel} from '../models';
import {TransferFormModel} from '../models';

export class TransferStore {
  @observable transfers: TransferModel[] = [];
  @observable newTransfer: TransferModel;
  @observable form: TransferFormModel;

  constructor(
    readonly rootStore: RootStore,
    private api: TransferApi,
    private lkkInvestmentApi: LkkInvestmentApi
  ) {
    this.newTransfer = this.createTransfer(false);
    this.form = new TransferFormModel();
  }

  @action
  sendInvestmentRequest = (model: LkkInvestmentModel) =>
    this.lkkInvestmentApi.sendRequest(model);

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

  convertToBaseCurrency = (transfer: TransferModel) => {
    const baseCurrency = this.rootStore.profileStore.baseAsset;

    if (!transfer.asset || !transfer.amount) {
      return 0;
    }

    return this.rootStore.marketService.convert(
      transfer.amount,
      transfer.asset.id,
      baseCurrency,
      this.rootStore.assetStore.getInstrumentById
    );
  };
}

export default TransferStore;
