import {Icon} from 'antd';
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
        <Icon type="close-circle" style={{color: 'red', fontSize: '64px'}} />
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
