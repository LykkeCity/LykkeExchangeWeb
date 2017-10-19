import * as classnames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {InjectedRootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import {loadable, LoadableProps} from '../hoc/loadable';
import WalletActionBar from '../WalletActionBar';
import WalletBalanceList from '../WalletBalanceList';
import WalletSummary from '../WalletSummary';
import './style.css';

type WalletListProps = InjectedRootStoreProps & LoadableProps;

export const WalletList: React.SFC<WalletListProps> = ({rootStore}) => (
  <section className="wallet_list">
    {rootStore!.walletStore.wallets.map(w => (
      <div key={w.id} className={classnames('wallet')}>
        <div className="wallet__inner">
          <WalletSummary wallet={w} />
          {w.expanded && [
            <div className="row" key={WalletActionBar.name}>
              <div className="col-xs-12">
                <WalletActionBar wallet={w} />
              </div>
            </div>,
            <div className="row" key={WalletBalanceList.name}>
              <div className="col-xs-12">
                <WalletBalanceList wallet={w} />
              </div>
            </div>
          ]}
        </div>
      </div>
    ))}
  </section>
);

export default loadable(inject(STORE_ROOT)(observer(WalletList)));
