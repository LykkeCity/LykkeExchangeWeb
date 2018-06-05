import {observable, runInAction} from 'mobx';
import {TransactionApi} from '../api/transactionApi';
import {TransactionModel, TransactionType} from '../models';
import {RootStore} from './index';

export class TransactionStore {
  @observable assetTransactions: TransactionModel[] = [];

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
  };
}
