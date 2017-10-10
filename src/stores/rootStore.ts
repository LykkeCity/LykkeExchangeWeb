import {AuthStore, WalletStore} from '.';
import {AuthApi} from '../api';

export class RootStore {
  readonly authStore: AuthStore;
  readonly walletStore: WalletStore;

  constructor() {
    this.authStore = new AuthStore(this, new AuthApi());
    this.walletStore = new WalletStore(this);
  }
}

export default RootStore;
