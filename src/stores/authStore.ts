import {computed, observable, reaction, runInAction} from 'mobx';
import {RootStore} from '.';
import {AuthApi} from '../api';
import {AUTH_SCOPE, queryStringFromObject} from '../utils/authUtils';
import {AuthUtils, StorageUtils} from '../utils/index';

const TOKEN_KEY = 'lww-token';
const OAUTH_KEY = 'lww-oauth';

const tokenStorage = StorageUtils.withKey(TOKEN_KEY);
const authStorage = StorageUtils.withKey(OAUTH_KEY);

export class AuthStore {
  readonly rootStore: RootStore;
  @observable token = tokenStorage.get();

  constructor(rootStore: RootStore, private api?: AuthApi) {
    this.rootStore = rootStore;
    reaction(
      () => this.token,
      token => {
        if (token) {
          tokenStorage.set(token);
        } else {
          tokenStorage.clear();
          authStorage.clear();
        }
      }
    );
  }

  auth = async (code: string) => {
    const authContext = await this.fetchBearerToken(code);
    authStorage.set(JSON.stringify(authContext));
    const sessionToken = await this.fetchSessionToken();
    runInAction(() => {
      this.token = sessionToken.token;
    });
  };

  fetchSessionToken = () =>
    this.api!.fetchSessionToken(AuthUtils.app.client_id, this.getAccessToken());

  fetchBearerToken = (code: string) =>
    this.api!.fetchBearerToken(
      AuthUtils.app,
      code,
      AuthUtils.connectUrls.token
    );

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
      runInAction(() => {
        this.token = null;
      });
    }, 1000);
  };

  getAccessToken = () => {
    const authContext = authStorage.get();
    return authContext && JSON.parse(authContext).access_token;
  };

  @computed
  get isAuthenticated() {
    return !!this.token;
  }

  redirectToAuthServer = () => location.replace(this.getConnectUrl());
}
