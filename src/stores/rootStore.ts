import {
  AffiliateStore,
  AssetStore,
  AuthStore,
  BalanceStore,
  DepositStore,
  DialogStore,
  KycStore,
  ProfileStore,
  TransactionStore,
  TransferStore,
  UiStore,
  WalletStore,
  WithdrawStore
} from '.';
import {
  AssetApi,
  AuthApi,
  BalanceApi,
  DepositApi,
  DisclaimerApi,
  HistoryApi,
  LkkInvestmentApi,
  ProfileApi,
  TransactionApi,
  TransferApi,
  WalletApi,
  WithdrawApi
} from '../api';
import RestAffiliateApi from '../api/affiliateApi';
import {RestFeaturesApi} from '../api/featuresApi';
import {RestKycApi, RestKycApiV2} from '../api/kycApi';
import AnalyticsService from '../services/analyticsService';
import MarketService from '../services/marketService';
import {FeatureStore} from './featuresStore';
import SocketStore from './socketStore';

export class RootStore {
  affiliateStore: AffiliateStore;
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
  withdrawStore: WithdrawStore;
  analyticsService: any;
  marketService: any;
  socketStore: SocketStore;
  kycStore: KycStore;

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
    this.transferStore = new TransferStore(
      this,
      new TransferApi(this),
      new LkkInvestmentApi(this)
    );
    this.depositStore = new DepositStore(this, new DepositApi(this));
    this.withdrawStore = new WithdrawStore(this, new WithdrawApi(this));
    this.dialogStore = new DialogStore(this, new DisclaimerApi(this));
    this.analyticsService = AnalyticsService;
    this.marketService = MarketService;
    this.socketStore = new SocketStore(this);
    this.kycStore = new KycStore(new RestKycApi(this), new RestKycApiV2(this));
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
    this.transferStore = new TransferStore(
      this,
      new TransferApi(this),
      new LkkInvestmentApi(this)
    );
    this.depositStore = new DepositStore(this, new DepositApi(this));
    this.withdrawStore = new WithdrawStore(this, new WithdrawApi(this));
    this.dialogStore = new DialogStore(this, new DisclaimerApi(this));
    this.authStore.reset();
    this.marketService.reset();
    this.socketStore.reset();
  }
}

export default RootStore;
