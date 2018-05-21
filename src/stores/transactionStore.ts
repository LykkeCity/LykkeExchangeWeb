import {observable, runInAction} from 'mobx';
import {TransactionApi} from '../api/transactionApi';
import {TransactionModel} from '../models';
import {RootStore} from './index';

export class TransactionStore {
  @observable assetTransactions: TransactionModel[] = [];

  constructor(readonly rootStore: RootStore, private api: TransactionApi) {}

  fetchAssetTransactions = async (
    assetId: string,
    skip: number,
    take: number,
    operationType?: string
  ) => {
    const tradingWallet = this.rootStore.walletStore.tradingWallets[0];

    if (tradingWallet) {
      const response = await this.api.fetchWalletTransactions(
        tradingWallet.id,
        skip,
        take,
        assetId,
        operationType
      );
      runInAction(() => {
        this.assetTransactions = response.map(
          ({
            Id: id,
            Amount: amount,
            DateTime: dateTime,
            State: state,
            Type: type
          }: any) => {
            const asset = this.rootStore.assetStore.getById(assetId);

            return new TransactionModel({
              amount,
              asset,
              dateTime,
              id,
              state,
              type
            });
          }
        );
      });
    }
  };
}
