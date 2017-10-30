import {action, computed, observable, reaction} from 'mobx';
import {RootStore} from '.';
import {AuthApi} from '../api';
import {CredentialsModel} from '../models';
import {AUTH_SCOPE, queryStringFromObject} from '../utils/authUtils';
import {AuthUtils, TokenUtils} from '../utils/index';

const AUTH_TOKEN_KEY = 'lww-oauth';

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

  auth = async (code: string) => {
    const bearerToken = await this.getBearerToken(code);
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(bearerToken));
    const sessionToken = await this.getSessionToken();
    this.setToken(sessionToken.token);
  };

  @action setToken = (token: string) => (this.token = token);

  @action clearToken = () => (this.token = null);

  getAuthToken = async (credentials: CredentialsModel) => {
    const token = (await this.api!.getToken(credentials)).AccessToken;
    this.setToken(token);
    return token;
  };

  getSessionToken = () =>
    this.api!.getSessionToken(AuthUtils.app.client_id, this.getAccessToken());

  getBearerToken = (code: string) =>
    this.api!.getBearerToken(AuthUtils.app, code, AuthUtils.connectUrls.token);

  getConnectUrl = () => {
    const {client_id, redirect_uri} = AuthUtils.app;
    const authorizePath = `${AuthUtils.connectUrls
      .auth}?${queryStringFromObject({
      client_id,
      redirect_uri,
      response_type: 'code',
      scope: AUTH_SCOPE
    })}`;

    return `${process.env.REACT_APP_AUTH_URL}${authorizePath}`;
  };

  getLogoutUrl = () =>
    `${process.env.REACT_APP_AUTH_URL}${AuthUtils.connectUrls.logout}`;

  logout = async () => {
    const logoutwindow = window.open(
      `${process.env.REACT_APP_AUTH_URL}${AuthUtils.connectUrls.logout}`,
      'logoutWindow',
      'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=600,height=300,left=100,top=100'
    );
    await setTimeout(() => {
      logoutwindow.close();
      this.clearToken();
    }, 1000);
  };

  getAccessToken = () =>
    JSON.parse(localStorage.getItem(AUTH_TOKEN_KEY)!).access_token;

  @computed
  get isAuthenticated() {
    return !!this.token;
  }
}
