import * as classnames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import WalletActionBar from '../WalletActionBar';
import WalletBalanceList from '../WalletBalanceList';
import WalletSummary from '../WalletSummary';
import './style.css';

type WalletListProps = RootStoreProps;

export const WalletList: React.SFC<WalletListProps> = ({rootStore}) => (
  <div className="wallet_list">
    {rootStore!.walletStore.wallets.map(w => (
      <div
        key={w.id}
        className={classnames('wallet', {'wallet--expanded': w.expanded})}
      >
        <div className="wallet__inner">
          <WalletSummary wallet={w} />
          {w.expanded && (
            <div className="wallet__expanded">
              <div key={WalletActionBar.name}>
                <WalletActionBar wallet={w} />
              </div>
              <div key={WalletBalanceList.name}>
                <WalletBalanceList wallet={w} />
              </div>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);

export default inject(STORE_ROOT)(observer(WalletList));
