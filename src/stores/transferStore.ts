import {observable} from 'mobx';
import {RootStore} from '.';
import {ConverterApi, TransferApi} from '../api';
import {DirectionModel, TransferModel} from '../models';

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

  convertToBaseCurrency = (transfer: TransferModel, baseCurrency: string) =>
    this.converter!.convertToBaseCurrency({
      AssetsFrom: [
        {
          Amount: transfer.amount,
          AssetId: transfer.asset
        }
      ],
      BaseAssetId: baseCurrency,
      OrderAction: DirectionModel.Buy
    });
}

export default TransferStore;
