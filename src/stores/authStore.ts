import {observable, reaction, action} from 'mobx';
import {RootStore} from '.';
import {AuthApi} from '../api';
import {Credentials} from '../models/structs';
import {TokenUtils} from '../utils/index';

export class AuthStore {
  readonly rootStore: RootStore;

  @observable token = TokenUtils.get();

  constructor(rootStore: RootStore, private api?: AuthApi) {
    this.rootStore = rootStore;
    reaction(
      () => this.token,
      token => {
        if (token) {
          TokenUtils.set(token);
        } else {
          TokenUtils.clear();
        }
      }
    );
  }

  @action setToken = (token: string) => (this.token = token);

  signIn = async (credentials: Credentials) => {
    const resp = await this.api!.signIn(credentials);
    return resp;
  };
}
