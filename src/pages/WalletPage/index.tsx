import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Redirect} from 'react-router';
import {InjectedRootStoreProps} from '../../App';
import WalletList from '../../components/WalletList';
import {ROUTE_LOGIN} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';

export class WalletPage extends React.Component<InjectedRootStoreProps> {
  private readonly authStore = this.props.rootStore!.authStore;
  private readonly walletStore = this.props.rootStore!.walletStore;

  componentDidMount() {
    this.walletStore.fetchAll();
  }

  render() {
    return !this.authStore.token ? ( // FIXME: refactor to ProtectedRoute HOC
      <Redirect to={ROUTE_LOGIN} />
    ) : (
      <WalletList loading={this.walletStore.loading} />
    );
  }
}

export default inject(STORE_ROOT)(observer(WalletPage));
