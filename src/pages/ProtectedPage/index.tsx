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

const WALLETS_UPDATE_INTERVAL_MS = 10000;

import {
  TransferFail,
  TransferResult
} from '../../components/TransferResult/index';
import {
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
import TransferPage from '../TransferPage/index';

export class ProtectedPage extends React.Component<RootStoreProps> {
  walletsTimer: any;

  private readonly walletStore = this.props.rootStore!.walletStore;
  private readonly profileStore = this.props.rootStore!.profileStore;
  private readonly uiStore = this.props.rootStore!.uiStore;
  private readonly assetStore = this.props.rootStore!.assetStore;

  @computed
  private get classes() {
    return {
      app: true,
      'app--overlayed': this.props.rootStore!.uiStore.overlayed
    };
  }

  updateWalletsBalances = async () => {
    await this.walletStore.updateWalletsBalances();
  };

  intervalFetchWalletsBalances() {
    this.walletsTimer = setInterval(
      () => this.updateWalletsBalances(),
      WALLETS_UPDATE_INTERVAL_MS
    );
  }

  componentDidMount() {
    this.uiStore.startRequest();
    this.assetStore
      .fetchCategories()
      .then(() => this.assetStore.fetchAssets())
      .then(() => this.profileStore.fetchUserInfo())
      .then(() => this.walletStore.fetchWallets())
      .then(() => this.intervalFetchWalletsBalances())
      .then(() => this.profileStore.fetchBaseAsset())
      .then(() => this.uiStore.finishRequest());
  }

  componentWillUnmount() {
    clearInterval(this.walletsTimer);
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
