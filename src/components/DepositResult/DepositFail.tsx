import {Icon} from '@lykkecity/react-components';
import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {ROUTE_WALLETS} from '../../constants/routes';

import './style.css';

export default class DepositFail extends React.Component<
  RouteComponentProps<any>
> {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className="deposit-result">
        <Icon
          className="deposit-result__icon deposit-result__icon_fail"
          type="cancel_round"
        />
        <div className="deposit-result__desc">Your deposit request failed</div>
        <div className="deposit-result__button">
          <Link to={ROUTE_WALLETS} className="btn btn--primary">
            Go back to wallets
          </Link>
        </div>
      </div>
    );
  }
}
