import {Icon} from 'antd';
import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {ROUTE_WALLET} from '../../constants/routes';
import './style.css';

export const TransferResult: React.SFC<RouteComponentProps<any>> = ({
  location
}) => (
  <div className="transfer-result">
    <Icon type="check-circle" style={{color: 'limegreen', fontSize: '64px'}} />
    <div className="transfer-result__desc">
      Your transfer transaction has been successfuly broadcasted to Blockchain.
      We will notify you when it will be confirmed.
    </div>
    <div className="transfer-result__amount">{10} BTC</div>
    <div className="transfer-result__actions">
      <Link to={ROUTE_WALLET}>Go back to wallets</Link>
    </div>
  </div>
);

export default TransferResult;
