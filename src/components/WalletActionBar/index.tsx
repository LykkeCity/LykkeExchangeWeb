import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {InjectedRootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import './style.css';

export class WalletActionBar extends React.Component<InjectedRootStoreProps> {
  render() {
    return (
      <div className="wallet-action-bar">
        <span className="wallet-action-bar__item">Deposit</span>
        <span className="wallet-action-bar__item">Withdraw</span>
        <button
          className="wallet-action-bar__button"
          onClick={this.props.rootStore!.uiStore.toggleCreateWalletDrawer}
        >
          + New Wallet
        </button>
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(WalletActionBar));
