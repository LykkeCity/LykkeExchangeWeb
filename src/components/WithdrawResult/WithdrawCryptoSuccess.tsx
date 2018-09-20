import {Icon} from '@lykkex/react-components';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_WALLETS} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {NumberFormat} from '../NumberFormat';

import './style.css';

export class WithdrawCryptoSuccess extends React.Component<
  RootStoreProps & RouteComponentProps<any>
> {
  private readonly withdrawStore = this.props.rootStore!.withdrawStore;

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const amount = Number(this.withdrawStore.withdrawCrypto.amount);
    const assetId = this.withdrawStore.withdrawCrypto.assetId;
    const asset = assetId && this.props.rootStore!.assetStore.getById(assetId);

    return (
      <div className="withdraw-result">
        <Icon
          className="withdraw-result__icon withdraw-result__icon_success"
          type="check_circle"
        />
        <div className="withdraw-result__desc">
          Your transfer transaction has been
          <br />successfuly broadcasted to Blockchain.
          <br />We will notify you when it will be confirmed.
        </div>
        {asset && (
          <div className="withdraw-result__amount">
            <NumberFormat value={amount} accuracy={asset.accuracy} />{' '}
            {asset.name}
          </div>
        )}
        <div className="withdraw-result__button">
          <Link to={ROUTE_WALLETS} className="btn btn--primary">
            Go back to wallets
          </Link>
        </div>
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(WithdrawCryptoSuccess));
