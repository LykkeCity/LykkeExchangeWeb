import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {loadable} from '../../components/hoc/loadable';
import {NoMatch} from '../../components/NoMatch/index';
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
  ROUTE_WALLETS_PRIVATE
} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {WalletPage} from '../../pages/index';
import TransferPage from '../TransferPage/index';

export class ProtectedPage extends React.Component<RootStoreProps> {
  // private readonly walletStore = this.props.rootStore!.walletStore;
  private readonly profileStore = this.props.rootStore!.profileStore;
  private readonly uiStore = this.props.rootStore!.uiStore;
  private readonly assetStore = this.props.rootStore!.assetStore;

  componentDidMount() {
    this.uiStore.startRequest();
    this.assetStore
      .fetchCategories()
      .then(() => this.assetStore.fetchAssets())
      // .then(() => this.walletStore.fetchWallets())
      .then(() => this.profileStore.fetchBaseAsset())
      .then(() => this.profileStore.fetchFirstName())
      .then(() => this.uiStore.finishRequest());
  }

  render() {
    const asLoading = loadable(this.uiStore.hasPendingRequests);
    return (
      <div className="app__shell">
        <Switch>
          <Redirect exact={true} path={ROUTE_ROOT} to={ROUTE_WALLETS_PRIVATE} />
          <Redirect
            exact={true}
            path={ROUTE_WALLETS}
            to={ROUTE_WALLETS_PRIVATE}
          />
          <Route path={ROUTE_WALLETS} component={WalletPage} />
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
    );
  }
}

export default inject(STORE_ROOT)(observer(ProtectedPage));
