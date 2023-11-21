import {Icon} from '@lykkecity/react-components';
import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
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
          <a
            className="btn btn--primary"
            href="#"
            onClick={this.handleTryAgain}
          >
            Try again
          </a>
        </div>
      </div>
    );
  }

  private handleTryAgain = (e: any) => {
    e.preventDefault();
    this.props.history.replace(ROUTE_WITHDRAW_CRYPTO_FROM(this.assetId));
  };
}

export default inject(STORE_ROOT)(observer(WithdrawCryptoFail));
