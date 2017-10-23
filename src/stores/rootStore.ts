import {AuthStore, BalanceStore, TransferStore, UiStore, WalletStore} from '.';
import {
  AuthApi,
  BalanceApi,
  ConverterApi,
  TransferApi,
  WalletApi
} from '../api';

export class RootStore {
  readonly authStore: AuthStore;
  readonly walletStore: WalletStore;
  readonly balanceStore: BalanceStore;
  readonly uiStore: UiStore;
  readonly transferStore: TransferStore;

  constructor() {
    const converter = new ConverterApi();
    this.authStore = new AuthStore(this, new AuthApi());
    this.walletStore = new WalletStore(this, new WalletApi(), converter);
    this.balanceStore = new BalanceStore(this, new BalanceApi());
    this.uiStore = new UiStore(this);
    this.transferStore = new TransferStore(this, new TransferApi(), converter);
  }
}

export default RootStore;
