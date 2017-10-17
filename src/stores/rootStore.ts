import {AuthStore, BalanceStore, UiStore, WalletStore} from '.';
import {AuthApi, BalanceApi, WalletApi} from '../api';

export class RootStore {
  readonly authStore: AuthStore;
  readonly walletStore: WalletStore;
  readonly balanceStore: BalanceStore;
  readonly uiStore: UiStore;

  constructor() {
    this.authStore = new AuthStore(this, new AuthApi());
    this.walletStore = new WalletStore(this, new WalletApi());
    this.balanceStore = new BalanceStore(this, new BalanceApi());
    this.uiStore = new UiStore(this);
  }
}

export default RootStore;
