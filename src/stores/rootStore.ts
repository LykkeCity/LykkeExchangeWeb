import {AuthStore, TokenStore, WalletStore} from '.';
import {AuthApi} from '../api';

export class RootStore {
  readonly authStore: AuthStore;
  readonly walletStore: WalletStore;
  readonly tokenStore: TokenStore;

  constructor() {
    this.authStore = new AuthStore(this, new AuthApi());
    this.walletStore = new WalletStore(this);
    this.tokenStore = new TokenStore();
  }
}

export default RootStore;
