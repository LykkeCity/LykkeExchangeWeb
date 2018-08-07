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

  fetchExportCsvUrl = async (
    skip: number,
    assetId?: string,
    operationType?: TransactionType[]
  ) => {
    const idResponse = await this.post('/history/client/csv', {
      assetId,
      operationType,
      skip
    });

    if (idResponse) {
      const urlResponse = await this.getWithQuery('/history/client/csv', {
        id: idResponse.Id
      });

      // while (!urlResponse.Url) {
      //   urlResponse = await this.getWithQuery('/history/client/csv', {
      //     id: idResponse.Id
      //   });
      // }

      return (
        'https://www.sample-videos.com/csv/Sample-Spreadsheet-10-rows.csv' ||
        urlResponse.Url
      );

      // return urlResponse.Url;
    }
    return;
  };
}

export default RestHistoryApi;
