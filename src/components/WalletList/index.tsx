import * as classnames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_ASSET} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import WalletActionBar from '../WalletActionBar';
import WalletBalanceList from '../WalletBalanceList';
import WalletSummary, {WalletActions} from '../WalletSummary';
import './style.css';

type WalletListProps = RootStoreProps &
  WalletActions &
  RouteComponentProps<any>;

export const WalletList: React.SFC<WalletListProps> = ({
  rootStore,
  onEditWallet,
  history,
  match: {params: {type}}
}) => {
  const handleAssetRowClick = (assetId: string) => {
    history.push(ROUTE_ASSET(assetId));
  };

  return (
    <div className="wallet_list">
      {(type === 'hft'
        ? rootStore!.walletStore.apiWallets
        : rootStore!.walletStore.tradingWallets
      ).map(w => (
        <div
          key={w.id}
          className={classnames('wallet', {
            'wallet--expanded': w.expanded,
            'wallet--trading': type === 'trading'
          })}
        >
          <div className="wallet__inner">
            <WalletSummary wallet={w} onEditWallet={onEditWallet} />
            {w.expanded && (
              <div className="wallet__expanded">
                <div key={WalletActionBar.name}>
                  <WalletActionBar wallet={w} />
                </div>
                <div>
                  <WalletBalanceList
                    wallet={w}
                    onAssetRowClick={handleAssetRowClick}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default withRouter(inject(STORE_ROOT)(observer(WalletList)));
