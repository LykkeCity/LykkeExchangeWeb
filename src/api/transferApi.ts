import {TransferModel} from '../models/index';
import {RestApi} from './index';
import {ApiResponse} from './types/index';

interface TransferApi {
  transfer: (transfer: TransferModel) => ApiResponse<any>;
}

export class RestTransferApi extends RestApi implements TransferApi {
  transfer = (transfer: TransferModel) => this.post(`/transfer`, transfer); // TODO: replace with the actual url
}

export default TransferApi;
