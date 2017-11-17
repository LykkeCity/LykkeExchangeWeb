import {computed, observable, reaction, runInAction} from 'mobx';
import {RootStore} from '.';
import {AuthApi} from '../api';
import {config} from '../config';
import {queryStringFromObject} from '../utils/authUtils';
import {StorageUtils} from '../utils/index';

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
        }
      }
    );
  }

  login = async (username: string, password: string) => {
    const resp = await this.api!.login(username, password);
    this.token = resp.AccessToken;
  };

  signup = async (username: string, password: string) => {
    const resp = await this.api!.signup(username, password);
    runInAction(() => {
      this.rootStore.profileStore.firstName = resp.PersonalData.FirstName;
      this.rootStore.profileStore.lastName = resp.PersonalData.LastName;
      this.token = resp.Token;
    });
  };

  auth = async (code: string) => {
    const authContext = await this.fetchBearerToken(code);
    authStorage.set(JSON.stringify(authContext));
    const sessionToken = await this.fetchSessionToken();
    runInAction(() => {
      this.token = sessionToken.token;
    });
  };

  fetchSessionToken = () =>
    this.api!.fetchSessionToken(config.auth.client_id!, this.getAccessToken());

  fetchBearerToken = (code: string) =>
    this.api!.fetchBearerToken(config.auth, code, config.auth.apiUrls.token);

  getConnectUrl = () => {
    const {client_id, redirect_uri} = config.auth;
    const authorizePath = `${config.auth.apiUrls.auth}?${queryStringFromObject({
      client_id,
      redirect_uri,
      response_type: 'code',
      scope: config.auth.scope
    })}`;

    return `${config.auth.url}${authorizePath}`;
  };

  getLogoutUrl = () => `${config.auth.url}${config.auth.apiUrls.logout}`;

  logout = async () => {
    runInAction(() => {
      this.token = null;
      authStorage.clear();
    });
  };

  getAccessToken = () => {
    const authContext = authStorage.get();
    return authContext && JSON.parse(authContext).access_token;
  };

  @computed
  get isAuthenticated() {
    return !!this.token;
  }

  redirectToAuthServer = () => {
    tokenStorage.clear();
    location.replace(`//${location.hostname}:${location.port}/login`);
  };
}
