import {computed, observable, reaction, runInAction} from 'mobx';
import {RootStore} from '.';
import {AuthApi} from '../api';
import {config} from '../config';
import {queryStringFromObject} from '../utils/authUtils';
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
    this.api!.fetchSessionToken(config.auth.client_id, this.getAccessToken());

  fetchBearerToken = (code: string) =>
    this.api!.fetchBearerToken(config.auth, code, AuthUtils.connectUrls.token);

  getConnectUrl = () => {
    const {client_id, redirect_uri} = config.auth;
    // tslint:disable-next-line:no-console
    console.log('client ', config.auth, process.env.REACT_APP_CLIENT_ID);
    const authorizePath = `${AuthUtils.connectUrls
      .auth}?${queryStringFromObject({
      client_id,
      redirect_uri,
      response_type: 'code',
      scope: config.auth.scope
    })}`;

    return `${config.auth.url}${authorizePath}`;
  };

  getLogoutUrl = () => `${config.auth.url}${AuthUtils.connectUrls.logout}`;

  logout = async () => {
    const logoutwindow = window.open(
      `${config.auth.url}${AuthUtils.connectUrls.logout}`,
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
