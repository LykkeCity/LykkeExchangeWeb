import {observable, runInAction} from 'mobx';
import {RootStore} from '.';
import {AuthApi} from '../api';
import {Credentials} from '../models/structs';

export class AuthStore {
  readonly rootStore: RootStore;

  @observable isAuthenticated: boolean = false;

  constructor(rootStore: RootStore, private api?: AuthApi) {
    this.rootStore = rootStore;
  }

  signIn = async (credentials: Credentials) => {
    const resp = await this.api!.signIn(credentials);
    runInAction(() => (this.isAuthenticated = !!resp));
    return resp;
  };
}
