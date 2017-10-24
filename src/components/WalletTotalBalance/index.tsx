// import classnames from 'classnames';
import {observer} from 'mobx-react';
import * as React from 'react';
import {WalletModel} from '../../models';

interface WalletTotalBalanceProps {
  wallet: WalletModel;
}

export const WalletTotalBalance: React.SFC<WalletTotalBalanceProps> = ({
  wallet
}) => (
  <div className="wallet__total">
    <div className="wallet__total-balance">Total balance</div>
    <h3 className="wallet__total-balance-value">
      {wallet.totalBalanceInBaseCurrency.balance.toFixed(2)}{' '}
      {wallet.baseCurrency}
    </h3>
    {/* <div>
      <span className="wallet__figure">Received:</span>{' '}
      <span className="wallet__figure-val">
        {wallet.figures.received} {wallet.figures.assetId}
      </span>
    </div>
    <div>
      <span className="wallet__figure">Sent:</span>{' '}
      <span className="wallet__figure-val">
        {wallet.figures.sent} {wallet.figures.assetId}
      </span>
    </div>
    <div>
      <span className="wallet__figure">P&amp;L:</span>{' '}
      <span
        className={classnames('wallet__figure-val', 'wallet__figure-val--green')}
      >
        +{wallet.figures.pnl}
      </span>
    </div> */}
  </div>
);

export default observer(WalletTotalBalance);
