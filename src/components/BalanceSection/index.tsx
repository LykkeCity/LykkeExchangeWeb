import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_WALLETS} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import Section from '../Section';

import {moneyRound} from '../../utils';
import {asAssetBalance} from '../hoc/assetBalance';
import './style.css';

export const BalanceSection: React.SFC<RootStoreProps> = ({rootStore}) => {
  const {profileStore: {baseAssetAsModel}, walletStore} = rootStore!;

  return (
    <Section title="Balance">
      <div className="row balance-list">
        <div className="balance-list__item">
          <div className="balance-list__title">Total balance</div>
          <div className="balance-list__total">
            {!!baseAssetAsModel &&
              asAssetBalance(
                baseAssetAsModel,
                moneyRound(walletStore.totalBalance, baseAssetAsModel.accuracy)
              )}{' '}
            {!!baseAssetAsModel && baseAssetAsModel!.name}
          </div>
        </div>
        <div className="balance-list__item">
          <div className="balance-list__title">Available balance</div>
          <div className="balance-list__total">
            {!!baseAssetAsModel &&
              asAssetBalance(
                baseAssetAsModel,
                moneyRound(
                  walletStore.availableBalance,
                  baseAssetAsModel.accuracy
                )
              )}{' '}
            {!!baseAssetAsModel && baseAssetAsModel!.name}
          </div>
        </div>
        <div className="all-assets-link">
          <Link to={ROUTE_WALLETS}>All assets</Link>
        </div>
      </div>
    </Section>
  );
};
BalanceSection.displayName = 'BalanceSection';

export default inject(STORE_ROOT)(observer(BalanceSection));
