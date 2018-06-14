import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models';
import {moneyFloor} from '../../utils';
import {asAssetBalance} from '../hoc/assetBalance';

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
      {!!rootStore!.profileStore.baseAssetAsModel && (
        <span>
          {asAssetBalance(
            rootStore!.profileStore.baseAssetAsModel!,
            moneyFloor(
              wallet.totalBalance,
              rootStore!.profileStore.baseAssetAsModel!.accuracy
            )
          )}
          &nbsp;
          {rootStore!.profileStore.baseAssetAsModel!.name}
        </span>
      )}
    </h3>
  </div>
);

export default inject(STORE_ROOT)(observer(WalletTotalBalance));
