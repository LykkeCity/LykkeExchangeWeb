import 'antd/lib/table/style/css';
import {observer} from 'mobx-react';
import * as React from 'react';
import {WalletModel} from '../../models/index';

interface WalletBalanceListProps {
  wallet: WalletModel;
}

export const WalletBalanceList: React.SFC<WalletBalanceListProps> = ({
  wallet
}) => (
  <div className="wallet__balances">
    {/* // TODO: group by issuer */}
    <h3>
      Issuer <small>{wallet.balances.length} assets</small>
    </h3>
    <table>
      <thead>
        <tr>
          <th>Asset</th>
          <th>Base currency</th>
          <th>Amount</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {wallet.balances.map(b => (
          <tr key={b.assetId + b.balance}>
            <td>{b.assetId}</td>
            <td>{b.baseCurrency}</td>
            <td>
              {b.balance} {b.assetId}
            </td>
            <td>...</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default observer(WalletBalanceList);
