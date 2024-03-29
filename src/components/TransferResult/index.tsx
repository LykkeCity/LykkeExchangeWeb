import {Icon} from '@lykkecity/react-components';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_WALLETS_HFT} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {NumberFormat} from '../NumberFormat';
import './style.css';

export const TransferResult: React.SFC<
  RootStoreProps & RouteComponentProps<any>
> = props => {
  const {amount, assetId} = props.location.state;
  const assetStore = props.rootStore!.assetStore;
  const asset = assetStore.getById(assetId);

  return (
    <div className="transfer-result">
      <Icon
        className="transfer-result__icon transfer-result__icon_success"
        type="check_circle"
      />
      <div className="transfer-result__desc">
        Your transaction request has been successfully sent
      </div>
      {asset && (
        <div className="transfer-result__amount">
          <NumberFormat value={amount} accuracy={asset.accuracy} /> {asset.name}
        </div>
      )}
      <div className="transfer-result__button">
        <Link to={ROUTE_WALLETS_HFT} className="btn btn--primary">
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
      <Icon
        className="transfer-result__icon transfer-result__icon_fail"
        type="cancel_round"
      />
      <div className="transfer-result__desc">Your transaction {reason}</div>
      <div className="transfer-result__button">
        <Link to={ROUTE_WALLETS_HFT} className="btn btn--primary">
          Go back to wallets
        </Link>
      </div>
    </div>
  );
};

export default inject(STORE_ROOT)(observer(TransferResult));
