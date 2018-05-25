import {TransactionType} from '../models';
import {RootStore} from '../stores';
import {HistoryApi, RestApi} from './index';
import {ApiResponse} from './types/index';

export interface TransactionApi {
  fetchWalletTransactions: (
    walletId: string,
    skip: number,
    take: number,
    assetId?: string,
    operationType?: TransactionType[]
  ) => ApiResponse<any>;
}

export class RestTransactionApi extends RestApi implements TransactionApi {
  private historyApi: HistoryApi;

  constructor(rootStore: RootStore) {
    super(rootStore);
    this.historyApi = new HistoryApi(rootStore);
  }

  fetchWalletTransactions = (
    walletId: string,
    skip: number,
    take: number,
    assetId?: string,
    operationType?: TransactionType[]
  ) =>
    this.historyApi.fetchWalletHistory(
      walletId,
      skip,
      take,
      assetId,
      operationType
    );
}

export default RestTransactionApi;
