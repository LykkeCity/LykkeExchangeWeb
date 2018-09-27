import classnames from 'classnames';
import * as classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {AssetModel, WalletModel} from '../../models';
import {RootStore} from '../../stores';
import {moneyRound} from '../../utils';
import {asAssetBalance} from '../hoc/assetBalance';
import WalletTotalBalance from '../WalletTotalBalance';

import './style.css';

export interface WalletActions {
  onEditWallet?: (w: WalletModel) => void;
  baseAssetAsModel?: AssetModel;
}

interface WalletSummaryProps extends WalletActions {
  wallet: WalletModel;
}

export const WalletSummary: React.SFC<WalletSummaryProps> = ({
  wallet,
  onEditWallet,
  baseAssetAsModel
}) => (
  <div>
    <div className="row">
      <div className="col-sm-7">
        <div className="wallet__info">
          <h2
            onClick={wallet.toggleCollapse}
            className={classNames('wallet__title', 'text--truncate')}
          >
            {wallet.isTrading ? null : (
              <i
                className={classnames('icon', 'icon--edit_alt')}
                // tslint:disable-next-line:jsx-no-lambda
                onClick={e => {
                  e.stopPropagation();
                  onEditWallet!(wallet);
                }}
              />
            )}
            {wallet.title}
            {wallet.isTrading && (
              <div className="wallet__trading-balance">
                {asAssetBalance(
                  baseAssetAsModel!,
                  moneyRound(wallet.totalBalance, baseAssetAsModel!.accuracy)
                )}
                &nbsp;
                {baseAssetAsModel!.name}
              </div>
            )}
            {!wallet.isTrading && (
              <i
                className={classnames(
                  'icon',
                  wallet.expanded
                    ? 'icon--chevron-thin-up'
                    : 'icon--chevron-thin-down'
                )}
              />
            )}
          </h2>
          {!wallet.isTrading && (
            <div className="wallet__desc">
              {wallet.desc || 'No description'}
            </div>
          )}
        </div>
      </div>

      {!wallet.isTrading && (
        <div className="col-sm-5">
          <WalletTotalBalance wallet={wallet} />
        </div>
      )}
    </div>
  </div>
);

export default inject(({rootStore}: {rootStore: RootStore}) => ({
  baseAssetAsModel: rootStore!.profileStore.baseAssetAsModel!,
  onEditWallet: (wallet: WalletModel) => {
    rootStore.walletStore.selectedWallet = wallet;
    rootStore.uiStore.toggleEditWalletDrawer();
  }
}))(observer(WalletSummary));
