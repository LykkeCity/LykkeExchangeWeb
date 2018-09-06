import {computed, observable, reaction} from 'mobx';
import {UserManager} from 'oidc-client';
import {RootStore} from '.';
import {AuthApi} from '../api';
import {openIdConstants} from '../constants/openId';
import {StorageUtils} from '../utils/index';

const TOKEN_KEY = 'lww-token';
const tokenStorage = StorageUtils.withKey(TOKEN_KEY);

export class AuthStore {
  readonly rootStore: RootStore;
  @observable token = tokenStorage.get();

  private userManager: UserManager;

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

    const settings = {
      authority: process.env.REACT_APP_AUTH_URL!,
      automaticSilentRenew: true,
      client_id: process.env.REACT_APP_CLIENT_ID!,
      filterProtocolClaims: true,
      loadUserInfo: false,
      post_logout_redirect_uri: location.origin,
      redirect_uri: `${location.origin}/assets/signin-callback.html`,
      response_type: openIdConstants.responseType,
      silent_redirect_uri: `${location.origin}/assets/silent-callback.html`
    };

    this.userManager = new UserManager(settings);
    this.userManager.events.addSilentRenewError(() => {
      this.signOut();
    });
  }

  catchUnauthorized = () => {
    this.signOut();
  };

  fetchToken = async () => {
    const user = await this.userManager.getUser();
    const {access_token} = user;
    const {token} = await this.api!.fetchToken(access_token);
    this.token = token;
    tokenStorage.set(token);
    return Promise.resolve();
  };

  signIn = () => {
    this.userManager.signinRedirect();
  };

  signOut = async () => {
    this.rootStore.reset();
    this.userManager.signoutRedirect();
  };

  reset = () => {
    tokenStorage.clear();
  };

  @computed
  get isAuthenticated() {
    return !!this.token;
  }

  redirectToAuthServer = () => {
    tokenStorage.clear();
    this.signIn();
  };
}
