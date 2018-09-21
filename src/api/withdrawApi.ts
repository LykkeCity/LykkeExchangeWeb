import {WithdrawCryptoModel} from '../models';
import {RestApi} from './index';
import {ApiResponse} from './types/index';

export interface WithdrawApi {
  fetchFee: (assetId: string) => ApiResponse<any>;
  fetchWithdrawCryptoInfo: (assetId: string) => ApiResponse<any>;
  sendWithdrawCryptoRequest: (
    withdraw: WithdrawCryptoModel
  ) => ApiResponse<any>;
  validateWithdrawCryptoRequest: (
    assetId: string,
    withdraw: WithdrawCryptoModel
  ) => ApiResponse<any>;
  confirmWithdrawCryptoRequest: (
    operationId: string,
    code: string
  ) => ApiResponse<any>;
  fetchWithdrawCryptoOperation: (operationId: string) => ApiResponse<any>;
}

export class RestWithdrawApi extends RestApi implements WithdrawApi {
  fetchFee = (assetId: string) =>
    this.get(`/withdrawals/crypto/${assetId}/fee`);

  fetchWithdrawCryptoInfo = (assetId: string) =>
    this.get(`/withdrawals/crypto/${assetId}/info`);

  sendWithdrawCryptoRequest = (withdraw: WithdrawCryptoModel) =>
    this.post(`/operations/cashout/crypto`, withdraw.asJson);

  validateWithdrawCryptoRequest = (
    assetId: string,
    withdraw: WithdrawCryptoModel
  ) =>
    this.getWithQuery(
      `/withdrawals/crypto/${assetId}/validateAddress`,
      withdraw
    );

  confirmWithdrawCryptoRequest = (operationId: string, code: string) =>
    this.post(`/2fa/operation`, {
      OperationId: operationId,
      Signature: {
        Code: code
      },
      Type: 'google'
    });

  fetchWithdrawCryptoOperation = (operationId: string) =>
    this.get(`/operations/${operationId}`);
}

export default RestWithdrawApi;
