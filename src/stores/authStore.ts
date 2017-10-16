import {action, observable, reaction} from 'mobx';
import {RootStore} from '.';
import {AuthApi} from '../api';
import {Credentials} from '../models/structs';
import {AUTH_SCOPE, queryStringFromObject} from '../utils/authUtils';
import {AuthUtils, TokenUtils} from '../utils/index';

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

  getAuthToken = async (credentials: Credentials) => {
    const token = (await this.api!.getToken(credentials)).AccessToken;
    this.setToken(token);
    return token;
  };

  getSessionToken = async () => {
    const resp = await this.api!.getSessionToken(AuthUtils.app.client_id);
    // tslint:disable-next-line:no-console
    console.log(resp);
    this.setToken(resp.token);
  };

  getBearerToken = async (code: string) => {
    const resp = await this.api!.getBearerToken(
      AuthUtils.app,
      code,
      AuthUtils.connectUrls.token
    );
    localStorage.setItem('lww-oauth', JSON.stringify(resp));
  };

  getConnectUrl = () => {
    const {client_id, redirect_uri} = AuthUtils.app;
    const connectPath = `${AuthUtils.connectUrls.auth}?${queryStringFromObject({
      client_id,
      redirect_uri,
      response_type: 'code',
      scope: AUTH_SCOPE
    })}`;

    return `${process.env.REACT_APP_API_URL}${connectPath}`;
  };
}
