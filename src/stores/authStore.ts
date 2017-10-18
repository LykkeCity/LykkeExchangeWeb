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

  auth = async (code: string) => {
    if (!!code) {
      const bearerToken = await this.getBearerToken(code);
      localStorage.setItem('lww-oauth', JSON.stringify(bearerToken));
    }
    const sessionToken = await this.getSessionToken();
    // tslint:disable-next-line:no-console
    console.log(sessionToken);
    this.setToken(sessionToken.token);
  };

  @action setToken = (token: string) => (this.token = token);

  getAuthToken = async (credentials: Credentials) => {
    const token = (await this.api!.getToken(credentials)).AccessToken;
    this.setToken(token);
    return token;
  };

  getSessionToken = () =>
    this.api!.getSessionToken(
      AuthUtils.app.client_id,
      JSON.parse(localStorage.getItem('lww-oauth')!).access_token
    );

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
    this.setToken(null as any);
  };
}
