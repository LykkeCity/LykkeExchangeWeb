import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {loadable} from '../../components/hoc/loadable';
import {NoMatch} from '../../components/NoMatch/index';
import {TransferResult} from '../../components/TransferResult/index';
import {
  ROUTE_ROOT,
  ROUTE_TRANSFER,
  ROUTE_TRANSFER_SUCCESS,
  ROUTE_WALLETS,
  ROUTE_WALLETS_PRIVATE
} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {WalletPage} from '../../pages/index';
import TransferPage from '../TransferPage/index';

export class ProtectedPage extends React.Component<RootStoreProps> {
  private readonly walletStore = this.props.rootStore!.walletStore;
  private readonly profileStore = this.props.rootStore!.profileStore;
  private readonly uiStore = this.props.rootStore!.uiStore;

  componentDidMount() {
    this.uiStore.startRequest(3);
    this.walletStore.fetchWallets().then(() => this.uiStore.finishRequest());
    this.profileStore
      .fetchBaseAsset()
      .then(
        () => this.uiStore.finishRequest(),
        () => this.uiStore.finishRequest()
      );
    this.profileStore.fetchFirstName().then(() => this.uiStore.finishRequest());
  }

  render() {
    const withLoading = loadable(this.uiStore.hasPendingRequests);
    return (
      <div className="app__shell">
        <Switch>
          <Redirect exact={true} path={ROUTE_ROOT} to={ROUTE_WALLETS_PRIVATE} />
          <Redirect exact={true} path="/wallets" to={ROUTE_WALLETS_PRIVATE} />
          <Route path={ROUTE_WALLETS} component={withLoading(WalletPage)} />
          <Route path={ROUTE_TRANSFER} component={withLoading(TransferPage)} />
          <Route path={ROUTE_TRANSFER_SUCCESS} component={TransferResult} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(ProtectedPage));
