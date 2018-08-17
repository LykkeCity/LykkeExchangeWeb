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
    assetId?: string,
    operationType?: TransactionType[]
  ) => {
    const idResponse = await this.post('/history/client/csv', {
      assetId,
      operationType
    });

    if (idResponse) {
      let urlResponse = await this.getWithQuery('/history/client/csv', {
        id: idResponse.Id
      });

      if (!urlResponse.Url) {
        await new Promise(resolve => {
          const URL_POLL_TIMEOUT = 1000;
          const urlInterval = window.setInterval(async () => {
            urlResponse = await this.getWithQuery('/history/client/csv', {
              id: idResponse.Id
            });

            if (urlResponse.Url) {
              window.clearInterval(urlInterval);
              resolve();
            }
          }, URL_POLL_TIMEOUT);
        });
      }

      return urlResponse.Url;
    }
  };
}

export default RestHistoryApi;
