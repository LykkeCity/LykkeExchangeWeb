import {
  AffiliateStore,
  AppSettingsStore,
  AssetStore,
  AuthStore,
  BalanceStore,
  DepositCreditCardStore,
  ProfileStore,
  TransferStore,
  UiStore,
  WalletStore
} from '.';
import {
  AppSettingsApi,
  AssetApi,
  AuthApi,
  BalanceApi,
  ConverterApi,
  DepositCreditCardApi,
  ProfileApi,
  TransferApi,
  WalletApi
} from '../api';
import RestAffiliateApi from '../api/affiliateApi';
import {RestFeaturesApi} from '../api/featuresApi';
import {FeatureStore} from './featuresStore';

export class RootStore {
  affiliateStore: AffiliateStore;
  appSettingsStore: AppSettingsStore;
  authStore: AuthStore;
  walletStore: WalletStore;
  balanceStore: BalanceStore;
  featureStore: FeatureStore;
  uiStore: UiStore;
  transferStore: TransferStore;
  profileStore: ProfileStore;
  assetStore: AssetStore;
  depositCreditCardStore: DepositCreditCardStore;

  converter = new ConverterApi(this);

  constructor() {
    this.affiliateStore = new AffiliateStore(this, new RestAffiliateApi(this));
    this.assetStore = new AssetStore(this, new AssetApi(this));
    this.authStore = new AuthStore(this, new AuthApi(this));
    this.walletStore = new WalletStore(
      this,
      new WalletApi(this),
      this.converter
    );
    this.balanceStore = new BalanceStore(this, new BalanceApi(this));
    this.featureStore = new FeatureStore(new RestFeaturesApi(this));
    this.uiStore = new UiStore(this);
    this.transferStore = new TransferStore(
      this,
      new TransferApi(this),
      this.converter
    );
    this.profileStore = new ProfileStore(this, new ProfileApi(this));
    this.depositCreditCardStore = new DepositCreditCardStore(
      this,
      new DepositCreditCardApi(this)
    );
    this.appSettingsStore = new AppSettingsStore(
      this,
      new AppSettingsApi(this)
    );
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
    this.depositCreditCardStore = new DepositCreditCardStore(
      this,
      new DepositCreditCardApi(this)
    );
    this.appSettingsStore = new AppSettingsStore(
      this,
      new AppSettingsApi(this)
    );
    this.authStore.reset();
  }
}

export default RootStore;
