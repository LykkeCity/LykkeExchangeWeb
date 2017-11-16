import {Icon} from 'antd';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {ROUTE_WALLETS} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import './style.css';

export const TransferResult: React.SFC<RouteComponentProps<any>> = props => {
  const {amount, asset} = props.location.state;
  return (
    <div className="transfer-result">
      <Icon
        type="check-circle"
        style={{color: 'limegreen', fontSize: '64px'}}
      />
      <div className="transfer-result__desc">
        Your transaction request has been successfully sent
      </div>
      <div className="transfer-result__amount">
        {amount} {asset}
      </div>
      <div className="transfer-result__button">
        <Link to={ROUTE_WALLETS} className="btn btn--primary">
          Go back to wallets
        </Link>
      </div>
    </div>
  );
};

export const TransferFail: React.SFC<RouteComponentProps<any>> = ({
  location: {state: {reason}}
}) => {
  return (
    <div className="transfer-result">
      <Icon type="close-circle" style={{color: 'red', fontSize: '64px'}} />
      <div className="transfer-result__desc">Your transaction {reason}</div>
      <div className="transfer-result__button">
        <Link to={ROUTE_WALLETS} className="btn btn--primary">
          Go back to wallets
        </Link>
      </div>
    </div>
  );
};

export default inject(STORE_ROOT)(observer(TransferResult));
