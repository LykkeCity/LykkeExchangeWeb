import {AuthStore, BalanceStore, TransferStore, UiStore, WalletStore} from '.';
import {AuthApi, BalanceApi, TransferApi, WalletApi} from '../api';

export class RootStore {
  readonly authStore: AuthStore;
  readonly walletStore: WalletStore;
  readonly balanceStore: BalanceStore;
  readonly uiStore: UiStore;
  readonly transferStore: TransferStore;

  constructor() {
    this.authStore = new AuthStore(this, new AuthApi());
    this.walletStore = new WalletStore(this, new WalletApi());
    this.balanceStore = new BalanceStore(this, new BalanceApi());
    this.uiStore = new UiStore(this);
    this.transferStore = new TransferStore(this, new TransferApi());
  }
}

export default RootStore;
