import {RestApi} from './index';
import {ApiResponse} from './types/index';

export interface DialogApi {
  fetchPendingDialogs: () => ApiResponse<any>;
}

export class RestHistoryApi extends RestApi implements DialogApi {
  fetchPendingDialogs = () => this.get(`/dialogs/pending`);
}

export default RestHistoryApi;
