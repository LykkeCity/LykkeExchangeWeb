import {
  AuthStore,
  BalanceStore,
  ProfileStore,
  TransferStore,
  UiStore,
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
  readonly uiStore: UiStore;
  readonly transferStore: TransferStore;
  readonly profileStore: ProfileStore;

  constructor() {
    const converter = new ConverterApi();
    this.authStore = new AuthStore(this, new AuthApi());
    this.walletStore = new WalletStore(this, new WalletApi(), converter);
    this.balanceStore = new BalanceStore(this, new BalanceApi());
    this.uiStore = new UiStore(this);
    this.transferStore = new TransferStore(this, new TransferApi(), converter);
    this.profileStore = new ProfileStore(this, new ProfileApi());
  }
}

export default RootStore;
