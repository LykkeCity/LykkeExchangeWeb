import {TransferModel} from '../models/index';
import {RestApi} from './index';
import {ApiResponse} from './types/index';

export interface TransferApi {
  transfer: (transfer: TransferModel) => ApiResponse<any>;
}

export class RestTransferApi extends RestApi implements TransferApi {
  transfer = (transfer: TransferModel) =>
    this.post(`/operations/transfer/${transfer.id}`, transfer.asJson);
}

export default TransferApi;
