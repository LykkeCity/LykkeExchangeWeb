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
  ) =>
    new Promise<string>(async resolve => {
      const exportId = await this.api.fetchExportCsvId(assetId, operationType);
      const HISTORY_EXPORT_TOPIC = 'history.export';
      this.rootStore.socketStore.subscribe(
        HISTORY_EXPORT_TOPIC,
        (res: [{Id: string; Url: string}]) => {
          const {Id: id, Url: url} = res[0];
          if (url && id === exportId) {
            resolve(url);
          }
        }
      );
    });
}
