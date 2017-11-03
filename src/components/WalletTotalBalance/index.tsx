import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models';
import {NumberFormat} from '../NumberFormat';

interface WalletTotalBalanceProps extends RootStoreProps {
  wallet: WalletModel;
}

export const WalletTotalBalance: React.SFC<WalletTotalBalanceProps> = ({
  wallet,
  rootStore
}) => (
  <div className="wallet__total">
    <div className="wallet__total-balance">Total balance</div>
    <h3 className="wallet__total-balance-value">
      <NumberFormat value={wallet.totalBalance} />{' '}
      {rootStore!.profileStore.baseAsset}
    </h3>
  </div>
);

export default inject(STORE_ROOT)(observer(WalletTotalBalance));
