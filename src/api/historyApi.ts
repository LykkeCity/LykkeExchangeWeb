import {TransactionType} from '../models';
import {RestApi} from './index';
import {ApiResponse} from './types/index';

export interface HistoryApi {
  fetchWalletHistory: (
    walletId: string,
    skip: number,
    take: number,
    assetId?: string,
    operationType?: TransactionType[]
  ) => ApiResponse<any>;
}

export class RestHistoryApi extends RestApi implements HistoryApi {
  fetchWalletHistory = (
    walletId: string,
    skip: number,
    take: number,
    assetId?: string,
    operationType?: TransactionType[]
  ) =>
    this.getWithQuery(`/history/wallet/${walletId}`, {
      assetId,
      operationType,
      skip,
      take
    });

  fetchExportCsvId = async (
    assetId?: string,
    operationType?: TransactionType[]
  ) => {
    const idResponse = await this.post('/history/client/csv', {
      assetId,
      operationType
    });

    return idResponse.Id;
  };

  fetchExportCsvUrl = async (exportId: string) => {
    const urlResponse = await this.getWithQuery('/history/client/csv', {
      id: exportId
    });

    return urlResponse.Url;
  };
}

export default RestHistoryApi;
