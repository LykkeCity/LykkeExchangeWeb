import {Icon} from '@lykkex/react-components';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_WALLETS} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {NumberFormat} from '../NumberFormat';

import './style.css';

export class DepositSuccess extends React.Component<
  RootStoreProps & RouteComponentProps<any>
> {
  private readonly depositCreditCardStore = this.props.rootStore!
    .depositCreditCardStore;
  private readonly uiStore = this.props.rootStore!.uiStore;
  private readonly walletStore = this.props.rootStore!.walletStore;

  componentDidMount() {
    window.scrollTo(0, 0);

    this.uiStore.startRequest();
    this.walletStore.fetchWallets().then(() => this.uiStore.finishRequest());
  }

  render() {
    const amount = Number(this.depositCreditCardStore.newDeposit.amount);
    const {asset} = this.depositCreditCardStore.newDeposit;

    return (
      <div className="deposit-result">
        <Icon
          className="deposit-result__icon deposit-result__icon_success"
          type="check_circle"
        />
        <div className="deposit-result__desc">
          Your deposit request has been successfully sent
        </div>
        {asset && (
          <div className="deposit-result__amount">
            <NumberFormat value={amount} accuracy={asset.accuracy} />{' '}
            {asset.name}
          </div>
        )}
        <div className="deposit-result__button">
          <Link to={ROUTE_WALLETS} className="btn btn--primary">
            Go back to wallets
          </Link>
        </div>
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(DepositSuccess));
