import {WithdrawCryptoModel, WithdrawSwiftModel} from '../models';
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
  fetchWithdrawOperation: (operationId: string) => ApiResponse<any>;
  cancelWithdrawOperation: (operationId: string) => ApiResponse<any>;
  fetchSwiftDefaultValues: () => ApiResponse<any>;
  sendWithdrawSwiftRequest: (withdraw: WithdrawSwiftModel) => ApiResponse<any>;
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

  fetchWithdrawOperation = (operationId: string) =>
    this.get(`/operations/${operationId}`);

  cancelWithdrawOperation = (operationId: string) =>
    this.post(`/operations/cancel/${operationId}`);

  fetchSwiftDefaultValues = () => this.get('/withdrawals/swift/last');

  sendWithdrawSwiftRequest = (withdraw: WithdrawSwiftModel) =>
    this.post(`/operations/cashout/swift`, withdraw.asJson);
}

export default RestWithdrawApi;
