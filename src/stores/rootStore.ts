import {
  AffiliateStore,
  AssetStore,
  AuthStore,
  BalanceStore,
  ProfileStore,
  TransactionStore,
  TransferStore,
  UiStore,
  WalletStore
} from '.';
import {
  AssetApi,
  AuthApi,
  BalanceApi,
  ConverterApi,
  HistoryApi,
  ProfileApi,
  TransactionApi,
  TransferApi,
  WalletApi
} from '../api';
import RestAffiliateApi from '../api/affiliateApi';
import {RestFeaturesApi} from '../api/featuresApi';
import {FeatureStore} from './featuresStore';

export class RootStore {
  affiliateStore: AffiliateStore;
  authStore: AuthStore;
  walletStore: WalletStore;
  balanceStore: BalanceStore;
  featureStore: FeatureStore;
  uiStore: UiStore;
  transactionStore: TransactionStore;
  transferStore: TransferStore;
  profileStore: ProfileStore;
  assetStore: AssetStore;

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
    this.transactionStore = new TransactionStore(
      this,
      new TransactionApi(this, new HistoryApi(this))
    );
    this.balanceStore = new BalanceStore(this, new BalanceApi(this));
    this.featureStore = new FeatureStore(new RestFeaturesApi(this));
    this.profileStore = new ProfileStore(this, new ProfileApi(this));
    this.uiStore = new UiStore(this);
    this.transferStore = new TransferStore(
      this,
      new TransferApi(this),
      this.converter
    );
  }

  reset() {
    this.walletStore = new WalletStore(
      this,
      new WalletApi(this),
      this.converter
    );
    this.balanceStore = new BalanceStore(this, new BalanceApi(this));
    this.profileStore = new ProfileStore(this, new ProfileApi(this));
    this.uiStore = new UiStore(this);
    this.transactionStore = new TransactionStore(
      this,
      new TransactionApi(this, new HistoryApi(this))
    );
    this.transferStore = new TransferStore(
      this,
      new TransferApi(this),
      this.converter
    );
    this.authStore.reset();
  }
}

export default RootStore;
