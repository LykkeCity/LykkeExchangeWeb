import {observable, runInAction} from 'mobx';
import {DisclaimerApi} from '../api/disclaimerApi';
import {DialogModel} from '../models';
import {RootStore} from './index';

export class DialogStore {
  @observable assetDisclaimers: DialogModel[] = [];

  constructor(
    readonly rootStore: RootStore,
    private disclaimerApi: DisclaimerApi
  ) {}

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
            visible: false
          });

          dialog.actions = [];

          return dialog;
        }
      );
    });
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

  clearAssetDisclaimers = () => {
    this.assetDisclaimers = [];
  };
}
