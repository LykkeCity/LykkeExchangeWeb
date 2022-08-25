import {observable, runInAction} from 'mobx';
import {TransactionApi} from '../api/transactionApi';
import {TransactionModel, TransactionType} from '../models';
import {RootStore} from './index';

export class TransactionStore {
  @observable assetTransactions: TransactionModel[] = [];
  @observable walletTransactions: TransactionModel[] = [];

  constructor(readonly rootStore: RootStore, private api: TransactionApi) {}

  fetchAssetTransactions = async (
    walletId: string,
    assetId: string,
    skip: number,
    take: number,
    operationType?: TransactionType[]
  ) => {
    const response = await this.api.fetchWalletTransactions(
      walletId,
      skip,
      take,
      assetId,
      operationType
    );
    runInAction(() => {
      this.assetTransactions = response
        .map(
          ({
            Id: id,
            Amount: amount,
            Asset: transactionAssetId,
            DateTime: dateTime,
            State: state,
            Type: type
          }: any) => {
            const asset = this.rootStore.assetStore.getById(transactionAssetId);

            return new TransactionModel({
              amount,
              asset,
              dateTime,
              id,
              state,
              type
            });
          }
        )
        .filter((transaction: TransactionModel) => {
          return transaction.asset.id === assetId;
        });
    });
  };

  fetchWalletTransactions = async (
    walletId: string,
    skip: number,
    take: number,
    operationType?: TransactionType[]
  ) => {
    const response = await this.api.fetchWalletTransactions(
      walletId,
      skip,
      take,
      '',
      operationType
    );
    runInAction(() => {
      this.walletTransactions = response.map(
        ({
          Id: id,
          Amount: amount,
          Asset: assetId,
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
  };

  fetchTransactionsCsvUrl = async (
    operationType?: TransactionType[],
    assetId?: string
  ) => {
    const exportId = await this.api.fetchExportCsvId(assetId, operationType);
    while (true) {
      const url = await this.api.fetchExportCsvUrl(exportId);
      if (url) {
        return url;
      }
      await new Promise(resolve => setTimeout(resolve, 2 * 1000));
    }
  };
}
