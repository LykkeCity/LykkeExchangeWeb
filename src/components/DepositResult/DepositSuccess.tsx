import {Icon} from '@lykkex/react-components';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {AnalyticsEvent, Place} from '../../constants/analyticsEvents';
import {ROUTE_WALLETS} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {NumberFormat} from '../NumberFormat';

import './style.css';

export class DepositSuccess extends React.Component<
  RootStoreProps & RouteComponentProps<any>
> {
  private readonly depositStore = this.props.rootStore!.depositStore;
  private readonly uiStore = this.props.rootStore!.uiStore;
  private readonly walletStore = this.props.rootStore!.walletStore;
  private readonly analyticsService = this.props.rootStore!.analyticsService;

  componentDidMount() {
    window.scrollTo(0, 0);

    this.uiStore.startRequest();
    this.walletStore.fetchWallets().then(() => this.uiStore.finishRequest());
    this.analyticsService.track(
      AnalyticsEvent.FinishDeposit(
        Place.SuccessPage,
        'Credit Card',
        this.depositStore.newDeposit.asset &&
          this.depositStore.newDeposit.asset.id
      )
    );
  }

  render() {
    const amount = Number(this.depositStore.newDeposit.amount);
    const {asset} = this.depositStore.newDeposit;

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
