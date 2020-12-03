import {MenuItem} from '@lykkex/react-components';
import * as classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Redirect, Route, RouteComponentProps, Switch} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import CookieBanner from '../../components/CookieBanner';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import {loadable} from '../../components/hoc/loadable';
import {NoMatch} from '../../components/NoMatch/index';
import PaymentGateway from '../../components/PaymentGateway';

import {
  DepositFail,
  DepositRequisitesSent,
  DepositSuccess
} from '../../components/DepositResult';
import {TransferFail} from '../../components/TransferResult/index';
import TransferResult from '../../components/TransferResult/index';
import {
  LkkInvestmentSuccess,
  WithdrawCryptoFail,
  WithdrawCryptoSuccess,
  WithdrawSwiftFail,
  WithdrawSwiftSuccess
} from '../../components/WithdrawResult';
import {
  ROUTE_AFFILIATE,
  ROUTE_AFFILIATE_DETAILS,
  ROUTE_AFFILIATE_STATISTICS,
  ROUTE_ASSET_PAGE,
  ROUTE_CONFIRM_OPERATION,
  ROUTE_DEPOSIT_CREDIT_CARD,
  ROUTE_DEPOSIT_CREDIT_CARD_FAIL,
  ROUTE_DEPOSIT_CREDIT_CARD_GATEWAY,
  ROUTE_DEPOSIT_CREDIT_CARD_SUCCESS,
  ROUTE_DEPOSIT_CRYPTO,
  ROUTE_DEPOSIT_SWIFT,
  ROUTE_DEPOSIT_SWIFT_EMAIL_SENT,
  ROUTE_HISTORY,
  ROUTE_LKK_INVESTMENT,
  ROUTE_LKK_INVESTMENT_SUCCESS,
  ROUTE_PROFILE,
  ROUTE_ROOT,
  ROUTE_SECURITY,
  ROUTE_TRANSFER,
  ROUTE_TRANSFER_BASE,
  ROUTE_TRANSFER_FAIL,
  ROUTE_TRANSFER_SUCCESS,
  ROUTE_VERIFICATION,
  ROUTE_WALLETS,
  ROUTE_WALLETS_TRADING,
  ROUTE_WITHDRAW_CRYPTO,
  ROUTE_WITHDRAW_CRYPTO_FAIL,
  ROUTE_WITHDRAW_CRYPTO_SUCCESS,
  ROUTE_WITHDRAW_SWIFT,
  ROUTE_WITHDRAW_SWIFT_FAIL,
  ROUTE_WITHDRAW_SWIFT_SUCCESS
} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {
  ConfirmOperationPage,
  DepositCreditCardPage,
  DepositCryptoPage,
  DepositSwiftPage,
  LkkInvestmentPage,
  ProfilePage,
  SecurityPage,
  VerificationPage,
  WalletPage,
  WithdrawCryptoPage,
  WithdrawSwiftPage
} from '../../pages/index';
import AffiliatePage from '../AffiliatePage/index';
import AssetPage from '../AssetPage/index';
import HistoryPage from '../HistoryPage/index';
import TransferPage from '../TransferPage/index';

let RouteWithHeaderAndFooter: React.SFC<
  RootStoreProps & RouteComponentProps<any> & any
> = ({rootStore, ...routeProps}) => {
  const uiStore = rootStore!.uiStore;
  const classes = {
    app: true,
    'app--overlayed': rootStore!.uiStore.overlayed
  };
  const handleOutsideClick = (e: React.MouseEvent<any>) => {
    const {toggleBaseAssetPicker, showBaseCurrencyPicker} = uiStore;
    const isBaseAssetTarget = e.target !== document.getElementById('baseAsset');
    if (isBaseAssetTarget && showBaseCurrencyPicker) {
      toggleBaseAssetPicker();
    }
  };
  return (
    <div className={classNames(classes)} onClick={handleOutsideClick}>
      <div
        className={classNames({
          hidden: uiStore.hasPendingRequests
        })}
      >
        <Header />
      </div>
      <div className="app__shell">
        <Route {...routeProps} />
        <CookieBanner />
      </div>
      <div
        className={classNames({
          hidden: uiStore.hasPendingRequests
        })}
      >
        <Footer />
      </div>
    </div>
  );
};

RouteWithHeaderAndFooter = inject(STORE_ROOT)(
  observer(RouteWithHeaderAndFooter)
);

let NormalRoute: React.SFC<RootStoreProps & RouteComponentProps<any> & any> = ({
  rootStore,
  ...routeProps
}) => {
  const uiStore = rootStore!.uiStore;
  const classes = {
    app: true,
    'app--overlayed': rootStore!.uiStore.overlayed
  };
  const handleOutsideClick = (e: React.MouseEvent<any>) => {
    const {toggleBaseAssetPicker, showBaseCurrencyPicker} = uiStore;
    const isBaseAssetTarget = e.target !== document.getElementById('baseAsset');
    if (isBaseAssetTarget && showBaseCurrencyPicker) {
      toggleBaseAssetPicker();
    }
  };
  return (
    <div className={classNames(classes)} onClick={handleOutsideClick}>
      <Route {...routeProps} />
      <CookieBanner />
    </div>
  );
};

NormalRoute = inject(STORE_ROOT)(observer(NormalRoute));

export class ProtectedPage extends React.Component<
  RootStoreProps & RouteComponentProps<any>
> {
  private readonly walletStore = this.props.rootStore!.walletStore;
  private readonly profileStore = this.props.rootStore!.profileStore;
  private readonly uiStore = this.props.rootStore!.uiStore;
  private readonly affiliateStore = this.props.rootStore!.affiliateStore;
  private unlistenRouteChange: () => void;
  private readonly dialogStore = this.props.rootStore!.dialogStore;
  private readonly socketStore = this.props.rootStore!.socketStore;
  private readonly authStore = this.props.rootStore!.authStore;
  private readonly analyticsService = this.props.rootStore!.analyticsService;
  private readonly balanceStore = this.props.rootStore!.balanceStore;
  private readonly kycStore = this.props.rootStore!.kycStore;

  constructor(props: RootStoreProps & RouteComponentProps<any>) {
    super(props);
    this.uiStore.startRequest();
  }

  componentDidMount() {
    Promise.all([
      this.processRequest(this.profileStore.fetchUserInfo),
      this.processRequest(this.profileStore.fetch2faStatus),
      this.processRequest(this.profileStore.fetchBaseAsset),
      this.processRequest(this.kycStore.fetchTierInfo)
    ])
      .then(() => this.identifyAnalytics())
      .then(() => this.uiStore.finishRequest());

    const wampUrl = process.env.REACT_APP_WAMP_URL || '';
    const wampRealm = process.env.REACT_APP_WAMP_REALM || '';
    const token = this.authStore.token || '';
    this.socketStore.connect(wampUrl, wampRealm, token).then(() => {
      this.balanceStore.subscribe();
    });

    this.analyticsService.init();
    this.unlistenRouteChange = this.props.history.listen(() => {
      const path = this.props.history.location.pathname;
      if (path !== ROUTE_PROFILE && path !== ROUTE_SECURITY) {
        this.uiStore.activeHeaderMenuItem = MenuItem.Funds;
      }
      this.uiStore.hideModals();
      this.dialogStore.clearAssetDisclaimers();
      this.profileStore.fetch2faStatus();

      this.analyticsService.pageview(this.props.history.location.pathname);
    });
  }

  componentWillUnmount() {
    this.unlistenRouteChange();
  }

  render() {
    const asLoading = loadable(this.uiStore.hasPendingRequests);
    return (
      <Switch>
        <Redirect exact={true} path={ROUTE_ROOT} to={ROUTE_WALLETS_TRADING} />
        <Redirect
          exact={true}
          path={ROUTE_WALLETS}
          to={ROUTE_WALLETS_TRADING}
        />
        <RouteWithHeaderAndFooter
          path={ROUTE_WALLETS}
          component={asLoading(WalletPage)}
        />
        <RouteWithHeaderAndFooter
          path={ROUTE_ASSET_PAGE}
          component={asLoading(AssetPage)}
        />
        <RouteWithHeaderAndFooter
          exact={true}
          path={ROUTE_TRANSFER_BASE}
          component={asLoading(TransferPage)}
        />
        <RouteWithHeaderAndFooter
          path={ROUTE_TRANSFER}
          component={asLoading(TransferPage)}
        />
        <RouteWithHeaderAndFooter
          path={ROUTE_TRANSFER_SUCCESS}
          component={TransferResult}
        />
        <RouteWithHeaderAndFooter
          path={ROUTE_TRANSFER_FAIL}
          component={TransferFail}
        />
        <Redirect
          exact={true}
          path={ROUTE_AFFILIATE}
          to={
            this.affiliateStore.isAgreed
              ? ROUTE_AFFILIATE_STATISTICS
              : ROUTE_AFFILIATE_DETAILS
          }
        />
        <RouteWithHeaderAndFooter
          path={ROUTE_AFFILIATE}
          component={asLoading(AffiliatePage)}
        />
        <RouteWithHeaderAndFooter
          path={ROUTE_DEPOSIT_CREDIT_CARD_GATEWAY}
          component={PaymentGateway}
        />
        <RouteWithHeaderAndFooter
          path={ROUTE_DEPOSIT_CREDIT_CARD_SUCCESS}
          component={asLoading(DepositSuccess)}
        />
        <RouteWithHeaderAndFooter
          path={ROUTE_DEPOSIT_SWIFT_EMAIL_SENT}
          component={DepositRequisitesSent}
        />
        <RouteWithHeaderAndFooter
          path={ROUTE_DEPOSIT_CREDIT_CARD_FAIL}
          component={DepositFail}
        />
        <RouteWithHeaderAndFooter
          path={ROUTE_DEPOSIT_CREDIT_CARD}
          component={asLoading(DepositCreditCardPage)}
        />
        <RouteWithHeaderAndFooter
          path={ROUTE_DEPOSIT_SWIFT}
          component={asLoading(DepositSwiftPage)}
        />
        <RouteWithHeaderAndFooter
          path={ROUTE_DEPOSIT_CRYPTO}
          component={asLoading(DepositCryptoPage)}
        />
        <RouteWithHeaderAndFooter
          path={ROUTE_PROFILE}
          exact
          component={asLoading(ProfilePage)}
        />
        <RouteWithHeaderAndFooter
          path={ROUTE_SECURITY}
          exact
          component={asLoading(SecurityPage)}
        />
        <NormalRoute
          path={ROUTE_VERIFICATION}
          exact
          component={asLoading(VerificationPage)}
        />
        <RouteWithHeaderAndFooter
          path={ROUTE_WITHDRAW_CRYPTO_FAIL}
          exact
          component={WithdrawCryptoFail}
        />
        <RouteWithHeaderAndFooter
          path={ROUTE_WITHDRAW_CRYPTO_SUCCESS}
          exact
          component={WithdrawCryptoSuccess}
        />
        <RouteWithHeaderAndFooter
          path={ROUTE_WITHDRAW_CRYPTO}
          component={asLoading(WithdrawCryptoPage)}
        />
        <RouteWithHeaderAndFooter
          path={ROUTE_WITHDRAW_SWIFT_FAIL}
          exact
          component={WithdrawSwiftFail}
        />
        <RouteWithHeaderAndFooter
          path={ROUTE_WITHDRAW_SWIFT_SUCCESS}
          exact
          component={WithdrawSwiftSuccess}
        />
        <RouteWithHeaderAndFooter
          path={ROUTE_LKK_INVESTMENT_SUCCESS}
          exact
          component={LkkInvestmentSuccess}
        />
        <RouteWithHeaderAndFooter
          path={ROUTE_WITHDRAW_SWIFT}
          component={asLoading(WithdrawSwiftPage)}
        />
        <RouteWithHeaderAndFooter
          path={ROUTE_CONFIRM_OPERATION}
          component={asLoading(ConfirmOperationPage)}
        />
        <RouteWithHeaderAndFooter
          path={ROUTE_HISTORY}
          component={asLoading(HistoryPage)}
        />
        <RouteWithHeaderAndFooter
          path={ROUTE_LKK_INVESTMENT}
          component={asLoading(LkkInvestmentPage)}
        />
        <RouteWithHeaderAndFooter component={NoMatch} />
      </Switch>
    );
  }

  private processRequest = (request: () => Promise<void>) => {
    this.uiStore.startRequest();
    return request().then(() => this.uiStore.finishRequest());
  };

  private identifyAnalytics = () => {
    this.analyticsService.setUserId(this.profileStore.email);
    this.analyticsService.identify({
      assetsCount:
        this.walletStore.tradingWallets.length &&
        this.walletStore.tradingWallets[0].balances.length,
      is2faEnabled: !!this.profileStore.is2faEnabled,
      isKycPassed: !!this.profileStore.isKycPassed
    });
  };
}

export default inject(STORE_ROOT)(observer(ProtectedPage));
