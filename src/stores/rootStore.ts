import {AuthStore, BalanceStore, WalletStore} from '.';
import {AuthApi, BalanceApi, WalletApi} from '../api';

export class RootStore {
  readonly authStore: AuthStore;
  readonly walletStore: WalletStore;
  readonly balanceStore: BalanceStore;

  constructor() {
    this.authStore = new AuthStore(this, new AuthApi());
    this.walletStore = new WalletStore(this, new WalletApi());
    this.balanceStore = new BalanceStore(this, new BalanceApi());
  }
}

export default RootStore;
