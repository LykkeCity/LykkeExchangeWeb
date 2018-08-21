import {
  AffiliateStore,
  AssetStore,
  AuthStore,
  BalanceStore,
  CatalogsStore,
  DepositStore,
  DialogStore,
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
  CatalogsApi,
  DepositApi,
  DialogApi,
  HistoryApi,
  ProfileApi,
  TransactionApi,
  TransferApi,
  WalletApi
} from '../api';
import RestAffiliateApi from '../api/affiliateApi';
import {RestFeaturesApi} from '../api/featuresApi';
import MarketService from '../services/marketService';
import {FeatureStore} from './featuresStore';
import SocketStore from './socketStore';

export class RootStore {
  affiliateStore: AffiliateStore;
  catalogsStore: CatalogsStore;
  dialogStore: DialogStore;
  authStore: AuthStore;
  walletStore: WalletStore;
  balanceStore: BalanceStore;
  featureStore: FeatureStore;
  uiStore: UiStore;
  transactionStore: TransactionStore;
  transferStore: TransferStore;
  profileStore: ProfileStore;
  assetStore: AssetStore;
  depositStore: DepositStore;
  marketService: any;
  socketStore: SocketStore;

  constructor() {
    this.affiliateStore = new AffiliateStore(this, new RestAffiliateApi(this));
    this.assetStore = new AssetStore(this, new AssetApi(this));
    this.authStore = new AuthStore(this, new AuthApi(this));
    this.walletStore = new WalletStore(this, new WalletApi(this));
    this.transactionStore = new TransactionStore(
      this,
      new TransactionApi(this, new HistoryApi(this))
    );
    this.balanceStore = new BalanceStore(this, new BalanceApi(this));
    this.featureStore = new FeatureStore(new RestFeaturesApi(this));
    this.profileStore = new ProfileStore(this, new ProfileApi(this));
    this.uiStore = new UiStore(this);
    this.transferStore = new TransferStore(this, new TransferApi(this));
    this.depositStore = new DepositStore(this, new DepositApi(this));
    this.catalogsStore = new CatalogsStore(this, new CatalogsApi(this));
    this.dialogStore = new DialogStore(this, new DialogApi(this));
    this.marketService = MarketService;
    this.socketStore = new SocketStore(this);
  }

  reset() {
    this.walletStore = new WalletStore(this, new WalletApi(this));
    this.balanceStore = new BalanceStore(this, new BalanceApi(this));
    this.profileStore = new ProfileStore(this, new ProfileApi(this));
    this.uiStore = new UiStore(this);
    this.transactionStore = new TransactionStore(
      this,
      new TransactionApi(this, new HistoryApi(this))
    );
    this.transferStore = new TransferStore(this, new TransferApi(this));
    this.depositStore = new DepositStore(this, new DepositApi(this));
    this.catalogsStore = new CatalogsStore(this, new CatalogsApi(this));
    this.dialogStore = new DialogStore(this, new DialogApi(this));
    this.authStore.reset();
    this.marketService.reset();
    this.socketStore.reset();
  }
}

export default RootStore;
