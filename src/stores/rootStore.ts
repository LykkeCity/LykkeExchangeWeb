import {
  AffiliateStore,
  AssetStore,
  AuthStore,
  BalanceStore,
  ProfileStore,
  TransferStore,
  UiStore,
  WalletStore
} from '.';
import {
  AssetApi,
  AuthApi,
  BalanceApi,
  ConverterApi,
  ProfileApi,
  TransferApi,
  WalletApi
} from '../api';

export class RootStore {
  affiliateStore: AffiliateStore;
  authStore: AuthStore;
  walletStore: WalletStore;
  balanceStore: BalanceStore;
  uiStore: UiStore;
  transferStore: TransferStore;
  profileStore: ProfileStore;
  assetStore: AssetStore;

  converter = new ConverterApi(this);

  constructor() {
    this.affiliateStore = new AffiliateStore(this);
    this.assetStore = new AssetStore(this, new AssetApi(this));
    this.authStore = new AuthStore(this, new AuthApi(this));
    this.walletStore = new WalletStore(
      this,
      new WalletApi(this),
      this.converter
    );
    this.balanceStore = new BalanceStore(this, new BalanceApi(this));
    this.uiStore = new UiStore(this);
    this.transferStore = new TransferStore(
      this,
      new TransferApi(this),
      this.converter
    );
    this.profileStore = new ProfileStore(this, new ProfileApi(this));
  }

  reset() {
    this.walletStore = new WalletStore(
      this,
      new WalletApi(this),
      this.converter
    );
    this.balanceStore = new BalanceStore(this, new BalanceApi(this));
    this.uiStore = new UiStore(this);
    this.transferStore = new TransferStore(
      this,
      new TransferApi(this),
      this.converter
    );
    this.profileStore = new ProfileStore(this, new ProfileApi(this));
  }
}

export default RootStore;
