import {Icon} from '@lykkex/react-components';
import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_WITHDRAW_CRYPTO_FROM} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';

import './style.css';

export class WithdrawCryptoFail extends React.Component<
  RootStoreProps & RouteComponentProps<any>
> {
  readonly withdrawStore = this.props.rootStore!.withdrawStore;

  @observable assetId: string;

  componentDidMount() {
    this.assetId = this.withdrawStore.withdrawCrypto.assetId;
    this.withdrawStore.resetCurrentWithdraw();
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className="withdraw-result">
        <Icon
          className="withdraw-result__icon withdraw-result__icon_fail"
          type="cancel_round"
        />
        <div className="withdraw-result__desc">Something went wrong.</div>
        <div className="withdraw-result__button">
          <Link
            to={ROUTE_WITHDRAW_CRYPTO_FROM(this.assetId)}
            className="btn btn--primary"
          >
            Try again
          </Link>
        </div>
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(WithdrawCryptoFail));
