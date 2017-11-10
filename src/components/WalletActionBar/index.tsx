import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_TRANSFER_FROM, ROUTE_TRANSFER_TO} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models';
import './style.css';

interface WalletActionBarProps extends RootStoreProps {
  wallet: WalletModel;
}

export class WalletActionBar extends React.Component<WalletActionBarProps> {
  render() {
    const {wallet} = this.props;
    return (
      <div className="wallet-action-bar">
        <div className="wallet-action-bar__item">
          <Link to={ROUTE_TRANSFER_TO(wallet.id)}>Deposit</Link>
        </div>
        <div className="wallet-action-bar__item">
          <Link to={ROUTE_TRANSFER_FROM(wallet.id)}>Withdraw</Link>
        </div>
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(WalletActionBar));
