import {observer} from 'mobx-react';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {ROUTE_DEPOSIT_CREDIT_CARD_TO} from '../../constants/routes';
import {WalletModel} from '../../models/index';
import {plural} from '../../utils';
import {
  Dropdown,
  DropdownContainer,
  DropdownControl,
  DropdownList,
  DropdownListItem
} from '../Dropdown';
import {asAssetBalance, asBalance} from '../hoc/assetBalance';
import './style.css';

const ASSET_DEFAULT_ICON_URL = `${process.env
  .PUBLIC_URL}/images/assets/asset_default.jpg`;

interface WalletBalanceListProps {
  wallet: WalletModel;
}

export const WalletBalanceList: React.SFC<WalletBalanceListProps> = ({
  wallet
}) => (
  <div className="wallet__balances">
    {wallet.hasBalances || (
      <small style={{margin: 0}}>You don’t have any asset yet</small>
    )}
    {wallet.hasBalances &&
      Object.keys(wallet.getBalancesByCategory).map(x => {
        const balances = wallet.getBalancesByCategory[x];
        return (
          <div key={x}>
            <h3>
              {x}
              <small>
                {balances.length} {plural(balances.length, 'asset')}
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
                {balances.map(b => (
                  <tr key={b.assetId + b.balance}>
                    <td className="_asset">
                      <div className="issuer">
                        <div className="issuer__img">
                          <img
                            src={b.asset.iconUrl || ASSET_DEFAULT_ICON_URL}
                            alt="asset"
                            width={48}
                            height={48}
                          />
                        </div>
                        <div className="issuer__content">
                          <div className="issuer__name">{b.asset.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="_currency">
                      {asAssetBalance(b.baseAsset!, b.balanceInBaseAsset)}{' '}
                      {b.baseAsset!.name}
                    </td>
                    <td className="_amount">
                      {asBalance(b)} {b.asset.name}
                    </td>
                    <td className="_action">
                      <Dropdown trigger="click">
                        <DropdownControl>
                          <button type="button" className="btn btn--icon">
                            <i className="icon icon--actions" />
                          </button>
                        </DropdownControl>
                        <DropdownContainer>
                          <DropdownList className="asset-menu">
                            <DropdownListItem isCategory={true}>
                              Deposit
                            </DropdownListItem>
                            {b.asset.isBankDepositEnabled ? (
                              <DropdownListItem>
                                <Link
                                  to={ROUTE_DEPOSIT_CREDIT_CARD_TO(
                                    wallet.id,
                                    b.assetId
                                  )}
                                >
                                  <img
                                    className="icon"
                                    src={`${process.env
                                      .PUBLIC_URL}/images/paymentMethods/deposit-credit-card.svg`}
                                  />
                                  Credit Card
                                </Link>
                              </DropdownListItem>
                            ) : (
                              <DropdownListItem className="asset-menu__item_disabled">
                                <a>
                                  <img
                                    className="icon"
                                    src={`${process.env
                                      .PUBLIC_URL}/images/paymentMethods/deposit-credit-card.svg`}
                                  />
                                  Credit Card
                                </a>
                              </DropdownListItem>
                            )}
                          </DropdownList>
                        </DropdownContainer>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
  </div>
);

export default observer(WalletBalanceList);
