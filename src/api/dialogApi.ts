import {RestApi} from './index';
import {ApiResponse} from './types/index';

export interface DialogApi {
  fetchPendingDialogs: () => ApiResponse<any>;
  dialogAction: (dialogId: string, actionId: string) => ApiResponse<any>;
}

export class RestHistoryApi extends RestApi implements DialogApi {
  fetchPendingDialogs = () => this.get('/dialogs');
  dialogAction = (dialogId: string, actionId: string) =>
    this.post(`/dialogs/${dialogId}/actions/${actionId}`, undefined);
}

export default RestHistoryApi;
