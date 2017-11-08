import {
  AuthStore,
  BalanceStore,
  ProfileStore,
  TransferStore,
  UiStore,
  WalletBalanceStore,
  WalletStore
} from '.';
import {
  AuthApi,
  BalanceApi,
  ConverterApi,
  ProfileApi,
  TransferApi,
  WalletApi
} from '../api';

export class RootStore {
  readonly authStore: AuthStore;
  readonly walletStore: WalletStore;
  readonly balanceStore: BalanceStore;
  readonly walletBalanceStore: WalletBalanceStore;
  readonly uiStore: UiStore;
  readonly transferStore: TransferStore;
  readonly profileStore: ProfileStore;

  constructor() {
    this.authStore = new AuthStore(this, new AuthApi(this));
    const converter = new ConverterApi(this);
    this.walletStore = new WalletStore(this, new WalletApi(this), converter);
    this.balanceStore = new BalanceStore();
    this.walletBalanceStore = new WalletBalanceStore(
      this,
      new BalanceApi(this)
    );
    this.uiStore = new UiStore(this);
    this.transferStore = new TransferStore(
      this,
      new TransferApi(this),
      converter
    );
    this.profileStore = new ProfileStore(this, new ProfileApi(this));
  }
}

export default RootStore;
