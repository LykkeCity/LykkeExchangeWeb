import 'antd/lib/table/style/css';
import {observer} from 'mobx-react';
import * as React from 'react';
import {WalletModel} from '../../models/index';
import {plural} from '../../utils';
import './style.css';

interface WalletBalanceListProps {
  wallet: WalletModel;
}

export const WalletBalanceList: React.SFC<WalletBalanceListProps> = ({
  wallet
}) => (
  <div className="wallet__balances">
    {/* // TODO: group by issuer */}
    <h3>
      Issuer{' '}
      <small>
        {wallet.balances.length} {plural(wallet.balances.length, 'asset')}
      </small>
    </h3>
    <table className="table_assets">
      <thead>
        <tr>
          <th className="_asset">Asset</th>
          <th className="_currency">Base currency</th>
          <th className="_amount">Amount</th>
          <th className="_action">&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {wallet.balances.map(b => (
          <tr key={b.assetId + b.balance}>
            <td className="_asset">
              <div className="issuer">
                <div className="issuer__img">
                  <img
                    src="images/asset_default.jpg"
                    alt="asset"
                    width={48}
                    height={48}
                  />
                </div>
                <div className="issuer__content">
                  <div className="issuer__name">
                    {b.assetId}
                    <button type="button" className="btn btn--icon">
                      <i className="icon icon--qr_alt" />
                    </button>
                  </div>
                  <div className="issuer__desc issuer__desc--accent">
                    Limited offer
                  </div>
                </div>
              </div>
            </td>
            <td className="_currency">{b.assetId}</td>
            <td className="_amount">
              {b.balance} {b.assetId}
            </td>
            <td className="_action">
              <button type="button" className="btn btn--icon">
                <i className="icon icon--actions" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default observer(WalletBalanceList);
