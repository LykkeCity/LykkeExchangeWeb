import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_WALLET_TRANSFER_TO} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models';
import './style.css';

interface WalletActionBarProps extends RootStoreProps {
  wallet: WalletModel;
}

export class WalletActionBar extends React.Component<WalletActionBarProps> {
  render() {
    const {wallet, rootStore} = this.props;
    return (
      <div className="wallet-action-bar">
        <div className="wallet-action-bar__item">
          <Link to={ROUTE_WALLET_TRANSFER_TO(wallet.id)}>Deposit</Link>
        </div>
        <div className="wallet-action-bar__item">
          <Link to={ROUTE_WALLET_TRANSFER_TO(wallet.id)}>Withdraw</Link>
        </div>
        <button
          className="wallet-action-bar__button btn btn--primary btn-sm"
          onClick={rootStore!.uiStore.toggleCreateWalletDrawer}
        >
          <i className="icon icon--add" /> New Wallet
        </button>
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(WalletActionBar));
