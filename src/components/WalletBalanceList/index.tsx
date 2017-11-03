import Dropdown from 'antd/lib/dropdown/dropdown';
import 'antd/lib/table/style/css';
import {observer} from 'mobx-react';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {ROUTE_TRANSFER_FROM, ROUTE_TRANSFER_TO} from '../../constants/routes';
import {WalletModel} from '../../models/index';
import {plural} from '../../utils';
import {NumberFormat} from '../NumberFormat';
import './style.css';

const assetIcon = {
  BTC: 'bitcoin.png',
  ETH: 'ethereum-lykke.png',
  LKK: 'lykke.png',
  // tslint:disable-next-line:object-literal-sort-keys
  EUR: 'eur-lykke.png',
  USD: 'usd-lykke.png',
  CHF: 'franc-lykke.png'
};

const assetIconUrl = (asset: string) =>
  `${process.env.PUBLIC_URL}/images/assets/${assetIcon[asset.toUpperCase()] ||
    'asset_default.jpg'}`;

interface WalletBalanceListProps {
  wallet: WalletModel;
}

export const WalletBalanceList: React.SFC<WalletBalanceListProps> = ({
  wallet
}) => (
  <div className="wallet__balances">
    {wallet.hasBalances || (
      <small>
        {wallet.balances.length} {plural(wallet.balances.length, 'asset')}
      </small>
    )}
    {wallet.hasBalances && (
      <h3>
        {/* // TODO: group by issuer */}
        Issuer
        <small>
          {wallet.balances.length} {plural(wallet.balances.length, 'asset')}
        </small>
      </h3>
    )}
    {wallet.hasBalances && (
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
                      src={assetIconUrl(b.assetId)}
                      alt="asset"
                      width={48}
                      height={48}
                    />
                  </div>
                  <div className="issuer__content">
                    <div className="issuer__name">{b.assetId}</div>
                  </div>
                </div>
              </td>
              <td className="_currency">{b.assetId}</td>
              <td className="_amount">
                <NumberFormat value={b.balance} /> {b.assetId}
              </td>
              <td className="_action">
                <Dropdown
                  overlay={
                    <div className="asset-menu">
                      <div>
                        <Link to={ROUTE_TRANSFER_TO(wallet.id)}>Deposit</Link>
                      </div>
                      <div>
                        <Link to={ROUTE_TRANSFER_FROM(wallet.id)}>
                          Withdraw
                        </Link>
                      </div>
                    </div>
                  }
                  trigger={['click']}
                  placement="bottomCenter"
                >
                  <button type="button" className="btn btn--icon">
                    <i className="icon icon--actions" />
                  </button>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default observer(WalletBalanceList);
