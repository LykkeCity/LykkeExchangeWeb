import classnames from 'classnames';
import * as classNames from 'classnames';
import {observer} from 'mobx-react';
import * as React from 'react';
import {WalletModel} from '../../models';
import WalletTotalBalance from '../WalletTotalBalance/index';

interface WalletSummaryProps {
  wallet: WalletModel;
}

export const WalletSummary: React.SFC<WalletSummaryProps> = ({wallet}) => (
  <div>
    <div className="row">
      <div className="col-sm-7">
        <div className="wallet__info">
          <h2
            onClick={wallet.toggleCollapse}
            className={classNames('wallet__title', 'text--truncate')}
          >
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

export default observer(WalletSummary);
