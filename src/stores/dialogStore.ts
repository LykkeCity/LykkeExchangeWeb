import {observable, runInAction} from 'mobx';
import {DialogApi} from '../api/dialogApi';
import {DialogModel} from '../models';
import {DialogActionType} from '../models/dialogModel';
import {RootStore} from './index';

export class DialogStore {
  @observable pendingDialogs: DialogModel[] = [];

  constructor(readonly rootStore: RootStore, private api: DialogApi) {}

  fetchPendingDialogs = async () => {
    const response = await this.api.fetchPendingDialogs();
    runInAction(() => {
      this.pendingDialogs = response.map(
        ({
          Id: id,
          Header: header,
          Text: text,
          ConditionType: conditionType,
          Actions: actions
        }: any) => {
          const dialog = new DialogModel({
            conditionType,
            header,
            id,
            text,
            visible: false
          });

          dialog.actions = actions.map((action: any) => ({
            id: action.Id,
            text: action.Text,
            type: action.Type
          }));

          return dialog;
        }
      );
    });
  };

  submit = async (dialog: DialogModel) => {
    const submitAction = dialog.actions.find(
      action => action.type === DialogActionType.Submit
    );

    if (submitAction) {
      await this.api.dialogAction(dialog.id, submitAction.id);
    }
  };
}
