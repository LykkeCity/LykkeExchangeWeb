import {Icon} from 'antd';
import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {ROUTE_HOME} from '../../constants/routes';
import './style.css';

export const TransferResult: React.SFC<RouteComponentProps<any>> = ({
  location
}) => (
  <div className="transfer-result">
    <Icon type="check-circle" style={{color: 'green', fontSize: '64px'}} />
    <div className="transfer-result__desc">
      Your transfer transaction has been successfuly broadcasted to Blockchain.
      We will notify you when it will be confirmed.
    </div>
    <div className="transfer-result__amount">{location.state.amount} BTC</div>
    <div>
      <Link to={ROUTE_HOME}>Go back to wallets</Link>
    </div>
  </div>
);

export default TransferResult;
