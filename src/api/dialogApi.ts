import {RestApi} from './index';
import {ApiResponse} from './types/index';

export interface DialogApi {
  fetchPendingDialogs: () => ApiResponse<any>;
  submitDialog: (dialogId: string, actionId: string) => ApiResponse<any>;
}

export class RestHistoryApi extends RestApi implements DialogApi {
  fetchPendingDialogs = () => this.get('/dialogs');
  submitDialog = (dialogId: string, actionId: string) =>
    this.post(`/dialogs/${dialogId}/actions/${actionId}`);
}

export default RestHistoryApi;
