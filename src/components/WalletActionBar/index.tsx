import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {InjectedRootStoreProps} from '../../App';
import {ROUTE_TRANSFER} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models';
import './style.css';

interface WalletActionBarProps extends InjectedRootStoreProps {
  wallet: WalletModel;
}

export class WalletActionBar extends React.Component<WalletActionBarProps> {
  render() {
    return (
      <div className="wallet-action-bar">
        <span className="wallet-action-bar__item">Deposit</span>
        <span className="wallet-action-bar__item">Withdraw</span>
        <span className="wallet-action-bar__item">
          <Link to={ROUTE_TRANSFER} onClick={this.handleClickTransfer}>
            Transfer
          </Link>
        </span>
        <button
          className="wallet-action-bar__button"
          onClick={this.props.rootStore!.uiStore.toggleCreateWalletDrawer}
        >
          + New Wallet
        </button>
      </div>
    );
  }

  private readonly handleClickTransfer = () => {
    this.props.rootStore!.uiStore.rootStore!.uiStore.setCurrentWallet(
      this.props.wallet
    );
  };
}

export default inject(STORE_ROOT)(observer(WalletActionBar));
