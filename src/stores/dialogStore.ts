import {observable, runInAction} from 'mobx';
import {DialogApi} from '../api/dialogApi';
import {DisclaimerApi} from '../api/disclaimerApi';
import {DialogModel} from '../models';
import {DialogActionType} from '../models/dialogModel';
import {RootStore} from './index';

export class DialogStore {
  @observable pendingDialogs: DialogModel[] = [];
  @observable assetDisclaimers: DialogModel[] = [];

  constructor(
    readonly rootStore: RootStore,
    private api: DialogApi,
    private disclaimerApi: DisclaimerApi
  ) {}

  fetchPendingDialogs = async () => {
    this.pendingDialogs = [];
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

  fetchAssetDisclaimers = async () => {
    this.assetDisclaimers = [];
    const response = await this.disclaimerApi.fetchAssetDisclaimers();
    runInAction(() => {
      this.assetDisclaimers = response.Result.Disclaimers.map(
        ({Id: id, Text: text}: any) => {
          const dialog = new DialogModel({
            header: 'Terms of Service',
            id,
            text,
            visible: true
          });

          dialog.actions = [];

          return dialog;
        }
      );
    });
  };

  removeDialog = (dialog: DialogModel) => {
    this.pendingDialogs = this.pendingDialogs.filter(
      (pendingDialog: DialogModel) => dialog.id !== pendingDialog.id
    );
  };

  submit = async (dialog: DialogModel) => {
    const submitAction = dialog.actions.find(
      action => action.type === DialogActionType.Submit
    );

    if (submitAction) {
      await this.api.submitDialog(dialog.id, submitAction.id);
    }
  };

  closeAssetDisclaimer = (disclaimer: DialogModel) => {
    this.assetDisclaimers = this.assetDisclaimers.filter(
      (assetDisclaimer: DialogModel) => disclaimer.id !== assetDisclaimer.id
    );
  };

  approveAssetDisclaimer = async (disclaimer: DialogModel) => {
    await this.disclaimerApi.approveAssetDisclaimer(disclaimer.id);
    this.closeAssetDisclaimer(disclaimer);
  };

  declineAssetDisclaimer = async (disclaimer: DialogModel) => {
    this.closeAssetDisclaimer(disclaimer);
    await this.disclaimerApi.declineAssetDisclaimer(disclaimer.id);
  };
}
