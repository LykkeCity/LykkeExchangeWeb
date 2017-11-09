import {TransferModel} from '../models/index';
import {RestApi} from './index';
import {ApiResponse} from './types/index';

export interface TransferApi {
  startTransfer: (transfer: TransferModel) => ApiResponse<any>;
  cancelTransfer: (transfer: TransferModel) => ApiResponse<any>;
  fetchOperationDetails: (transfer: TransferModel) => ApiResponse<any>;
}

export class RestTransferApi extends RestApi implements TransferApi {
  startTransfer = (transfer: TransferModel) =>
    this.apiBearerWretch()
      .url(`/operations/transfer/${transfer.id}`)
      .json(transfer.asJson)
      .post()
      .text();

  cancelTransfer = (transfer: TransferModel) =>
    this.apiBearerWretch()
      .url(`/operations/cancel/${transfer.id}`)
      .post();

  fetchOperationDetails = (transfer: TransferModel) =>
    this.get(`/operations/${transfer.id}`);
}

export default TransferApi;
