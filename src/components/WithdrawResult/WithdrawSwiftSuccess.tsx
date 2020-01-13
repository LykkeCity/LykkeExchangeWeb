import {Icon} from '@lykkex/react-components';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {AnalyticsEvent, Place} from '../../constants/analyticsEvents';
import {ROUTE_WALLETS} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';

import './style.css';

export class WithdrawSwiftSuccess extends React.Component<
  RootStoreProps & RouteComponentProps<any>
> {
  private readonly withdrawStore = this.props.rootStore!.withdrawStore;
  private readonly analyticsService = this.props.rootStore!.analyticsService;

  componentDidMount() {
    window.scrollTo(0, 0);

    this.analyticsService.track(
      AnalyticsEvent.FinishWithdraw(
        Place.SuccessPage,
        'SWIFT',
        this.withdrawStore.withdrawSwift.assetId
      )
    );
  }

  render() {
    return (
      <div className="withdraw-result">
        <Icon
          className="withdraw-result__icon withdraw-result__icon_success"
          type="check_circle"
        />
        <div className="withdraw-result__desc">
          Your withdrawal request is now being processed by our team…
        </div>
        <div className="withdraw-result__button">
          <Link to={ROUTE_WALLETS} className="btn btn--primary">
            Go back to wallets
          </Link>
        </div>
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(WithdrawSwiftSuccess));
