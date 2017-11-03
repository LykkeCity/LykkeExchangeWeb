import {TransferModel} from '../models/index';
import {RestApi} from './index';
import {ApiResponse} from './types/index';

export interface TransferApi {
  transfer: (transfer: TransferModel) => ApiResponse<any>;
  fetchOperationDetails: (transfer: TransferModel) => ApiResponse<any>;
}

export class RestTransferApi extends RestApi implements TransferApi {
  transfer = (transfer: TransferModel) =>
    this.post(`/operations/transfer/${transfer.id}`, transfer.asJson);

  fetchOperationDetails = (transfer: TransferModel) =>
    this.get(`/operations/${transfer.id}`);
}

export default TransferApi;
