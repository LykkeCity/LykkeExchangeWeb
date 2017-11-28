import classnames from 'classnames';
import * as classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {WalletModel} from '../../models';
import {RootStore, UiStore, WalletStore} from '../../stores';
import WalletTotalBalance from '../WalletTotalBalance';

export interface WalletActions {
  onEditWallet?: (w: WalletModel) => void;
}

interface WalletSummaryProps extends WalletActions {
  wallet: WalletModel;
  walletStore?: WalletStore;
  uiStore?: UiStore;
}

export const WalletSummary: React.SFC<WalletSummaryProps> = ({
  wallet,
  walletStore,
  uiStore,
  onEditWallet
}) => (
  <div>
    <div className="row">
      <div className="col-sm-7">
        <div className="wallet__info">
          <h2
            onClick={wallet.toggleCollapse}
            className={classNames('wallet__title', 'text--truncate')}
          >
            <i
              style={{position: 'absolute', left: '-30px', top: '10px'}}
              className={classnames('icon', 'icon--save_template')}
              // tslint:disable-next-line:jsx-no-lambda
              onClick={() => {
                walletStore!.selectedWallet = wallet;
                uiStore!.toggleWalletDrawer();
              }}
            />
            {wallet.title}
            <i
              className={classnames(
                'icon',
                wallet.expanded
                  ? 'icon--chevron-thin-up'
                  : 'icon--chevron-thin-down'
              )}
            />
          </h2>
          <div className="wallet__desc">{wallet.desc}</div>
        </div>
      </div>
      <div className="col-sm-5">
        <WalletTotalBalance wallet={wallet} />
      </div>
    </div>
  </div>
);

export default inject(({rootStore}: {rootStore: RootStore}) => ({
  uiStore: rootStore.uiStore,
  walletStore: rootStore.walletStore
}))(observer(WalletSummary));
