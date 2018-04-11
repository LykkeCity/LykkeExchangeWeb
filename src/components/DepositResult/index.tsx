import {Icon} from 'antd';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_WALLETS} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';

import './style.css';

export const DepositSuccess: React.SFC<
  RootStoreProps & RouteComponentProps<any>
> = props => {
  const {amount, asset} = props.rootStore!.depositCreditCardStore.newDeposit;
  return (
    <div className="deposit-result">
      <Icon
        type="check-circle"
        style={{color: 'limegreen', fontSize: '64px'}}
      />
      <div className="deposit-result__desc">
        Your deposit request has been successfully sent
      </div>
      <div className="deposit-result__amount">
        {amount} {asset && asset.name}
      </div>
      <div className="deposit-result__button">
        <Link to={ROUTE_WALLETS} className="btn btn--primary">
          Go back to wallets
        </Link>
      </div>
    </div>
  );
};

export const DepositFail: React.SFC<RouteComponentProps<any>> = () => {
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
};

export default inject(STORE_ROOT)(observer(DepositSuccess));
