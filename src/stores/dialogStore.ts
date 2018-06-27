import {observable, runInAction} from 'mobx';
import {DialogApi} from '../api/dialogApi';
import {DialogModel} from '../models';
import {RootStore} from './index';

export class DialogStore {
  @observable pendingDialogs: DialogModel[] = [];

  constructor(readonly rootStore: RootStore, private api: DialogApi) {}

  fetchPendingDialogs = async () => {
    const response = await this.api.fetchPendingDialogs();
    runInAction(() => {
      this.pendingDialogs = response.map(
        ({Id: id, Header: header, Text: text}: any) => {
          return new DialogModel({
            header,
            id,
            text
          });
        }
      );
    });
  };
}
