import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {ROUTE_WALLETS} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import Button from '../Button';
import Icon from '../Icon';
import './style.css';

export const TransferResult: React.SFC<RouteComponentProps<any>> = props => {
  const {amount, asset} = props.location.state;
  return (
    <div className="transfer-result">
      <Icon name="check-circle" color="limegreen" size="64px" />
      <div className="transfer-result__desc">
        Your transaction request has been successfully sent
      </div>
      <div className="transfer-result__amount">
        {amount} {asset}
      </div>
      <div className="transfer-result__button">
        <Button to={ROUTE_WALLETS}>Go back to wallets</Button>
      </div>
    </div>
  );
};

export const TransferFail: React.SFC<RouteComponentProps<any>> = ({
  location: {state: {reason}}
}) => {
  return (
    <div className="transfer-result">
      <Icon name="close-circle" color="red" size="64px" />
      <div className="transfer-result__desc">Your transaction {reason}</div>
      <div className="transfer-result__button">
        <Button to={ROUTE_WALLETS}>Go back to wallets</Button>
      </div>
    </div>
  );
};

export default inject(STORE_ROOT)(observer(TransferResult));
