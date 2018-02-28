import * as classNames from 'classnames';
import {computed} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import {loadable} from '../../components/hoc/loadable';
import {NoMatch} from '../../components/NoMatch/index';

import {
  TransferFail,
  TransferResult
} from '../../components/TransferResult/index';
import {
  ROUTE_AFFILIATE,
  ROUTE_AFFILIATE_DETAILS,
  ROUTE_AFFILIATE_STATISTICS,
  ROUTE_ROOT,
  ROUTE_TRANSFER,
  ROUTE_TRANSFER_BASE,
  ROUTE_TRANSFER_FAIL,
  ROUTE_TRANSFER_SUCCESS,
  ROUTE_WALLETS,
  ROUTE_WALLETS_TRADING
} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {WalletPage} from '../../pages/index';
import AffiliatePage from '../AffiliatePage/index';
import TransferPage from '../TransferPage/index';

export class ProtectedPage extends React.Component<RootStoreProps> {
  private readonly walletStore = this.props.rootStore!.walletStore;
  private readonly profileStore = this.props.rootStore!.profileStore;
  private readonly uiStore = this.props.rootStore!.uiStore;
  private readonly assetStore = this.props.rootStore!.assetStore;
  private readonly affiliateStore = this.props.rootStore!.affiliateStore;
  private readonly featuresStore = this.props.rootStore!.featuresStore;

  @computed
  private get classes() {
    return {
      app: true,
      'app--overlayed': this.props.rootStore!.uiStore.overlayed
    };
  }

  componentDidMount() {
    this.uiStore.startRequest();
    this.featuresStore.getFeatures();
    this.assetStore
      .fetchCategories()
      .then(() => this.assetStore.fetchAssets())
      .then(() => this.profileStore.fetchUserInfo())
      .then(() => this.walletStore.fetchWallets())
      .then(() => this.profileStore.fetchBaseAsset())
      .then(() => this.uiStore.finishRequest());
  }

  render() {
    const asLoading = loadable(this.uiStore.hasPendingRequests);
    return (
      <div
        className={classNames(this.classes)}
        onClick={this.handleOutsideClick}
      >
        <Header />
        <div className="app__shell">
          <Switch>
            <Redirect
              exact={true}
              path={ROUTE_ROOT}
              to={ROUTE_WALLETS_TRADING}
            />
            <Redirect
              exact={true}
              path={ROUTE_WALLETS}
              to={ROUTE_WALLETS_TRADING}
            />
            <Route path={ROUTE_WALLETS} component={asLoading(WalletPage)} />
            <Route
              exact={true}
              path={ROUTE_TRANSFER_BASE}
              component={asLoading(TransferPage)}
            />
            <Route path={ROUTE_TRANSFER} component={asLoading(TransferPage)} />
            <Route path={ROUTE_TRANSFER_SUCCESS} component={TransferResult} />
            <Route path={ROUTE_TRANSFER_FAIL} component={TransferFail} />
            <Redirect
              exact={true}
              path={ROUTE_AFFILIATE}
              to={
                this.affiliateStore.isAgreed
                  ? ROUTE_AFFILIATE_STATISTICS
                  : ROUTE_AFFILIATE_DETAILS
              }
            />
            <Route
              path={ROUTE_AFFILIATE}
              component={asLoading(AffiliatePage)}
            />
            <Route component={NoMatch} />
          </Switch>
        </div>
        <Footer />
      </div>
    );
  }

  private handleOutsideClick = (e: React.MouseEvent<any>) => {
    const {toggleBaseAssetPicker, showBaseCurrencyPicker} = this.props
      .rootStore!.uiStore;
    const isBaseAssetTarget = e.target !== document.getElementById('baseAsset');
    if (isBaseAssetTarget && showBaseCurrencyPicker) {
      toggleBaseAssetPicker();
    }
  };
}

export default inject(STORE_ROOT)(observer(ProtectedPage));
