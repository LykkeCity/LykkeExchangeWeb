import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {NoMatch} from '../../components/NoMatch/index';
import Spinner from '../../components/Spinner';
import {TransferResult} from '../../components/TransferResult/index';
import {
  ROUTE_ROOT,
  ROUTE_TRANSFER_SUCCESS,
  ROUTE_WALLET
} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {WalletPage} from '../../pages/index';

export class ProtectedPage extends React.Component<RootStoreProps> {
  private readonly walletStore = this.props.rootStore!.walletStore;
  private readonly profileStore = this.props.rootStore!.profileStore;
  private readonly uiStore = this.props.rootStore!.uiStore;

  componentDidMount() {
    this.uiStore.startFetch(2);
    this.walletStore.fetchWallets().then(() => this.uiStore.finishFetch());
    this.profileStore
      .fetchBaseCurrency()
      .then(() => this.uiStore.finishFetch(), () => this.uiStore.finishFetch());
    this.profileStore.fetchFirstName().then(() => this.uiStore.finishFetch());
  }

  render() {
    return this.uiStore.appLoaded ? (
      <div className="app__shell">
        <Switch>
          <Redirect
            exact={true}
            path={ROUTE_ROOT}
            from={ROUTE_ROOT}
            to={ROUTE_WALLET}
          />
          <Route path={ROUTE_WALLET} component={WalletPage} />
          <Route path={ROUTE_TRANSFER_SUCCESS} component={TransferResult} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    ) : (
      <Spinner />
    );
  }
}

export default inject(STORE_ROOT)(observer(ProtectedPage));
