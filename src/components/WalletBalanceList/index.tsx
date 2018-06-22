import {
  Dropdown,
  DropdownContainer,
  DropdownControl,
  DropdownList,
  DropdownListItem
} from '@lykkex/react-components';
import classnames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {
  ROUTE_ASSET,
  ROUTE_DEPOSIT_CREDIT_CARD_TO,
  ROUTE_TRANSFER_FROM
} from '../../constants/routes';
import {AssetModel, WalletModel} from '../../models/index';
import {RootStore} from '../../stores';
import {moneyFloor, plural} from '../../utils';
import {asAssetBalance, asBalance} from '../hoc/assetBalance';
import './style.css';

const ASSET_DEFAULT_ICON_URL = `${process.env
  .PUBLIC_URL}/images/assets/asset_default.jpg`;

interface WalletBalanceListProps {
  wallet: WalletModel;
  isKycPassed?: boolean;
  labels?: any;
  assetsAvailableForDeposit?: AssetModel[];
}

export const WalletBalanceList: React.SFC<WalletBalanceListProps> = ({
  wallet,
  isKycPassed,
  labels,
  assetsAvailableForDeposit = []
}) => (
  <div className="wallet__balances">
    {wallet.hasBalances || <small style={{margin: 0}}>{labels.NoAssets}</small>}
    {wallet.hasBalances &&
      Object.keys(wallet.getBalancesByCategory).map(x => {
        const balances = wallet.getBalancesByCategory[x];
        return (
          <div key={x}>
            <h3>
              {x}
              <small>
                {balances.length} {plural(balances.length, labels.AssetLower)}
              </small>
            </h3>
            <table className="table_assets">
              <thead>
                <tr>
                  <th className="_asset">
                    <span>{labels.Asset}</span>
                  </th>
                  <th className="_currency">{labels.BaseCurrency}</th>
                  <th className="_amount">{labels.Amount}</th>
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
                          <div className="issuer__name">
                            {wallet.isTrading ? (
                              <Link to={ROUTE_ASSET(b.assetId)}>
                                {b.asset.name}
                              </Link>
                            ) : (
                              b.asset.name
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="_currency">
                      {asAssetBalance(
                        b.baseAsset!,
                        moneyFloor(b.balanceInBaseAsset, b.baseAsset!.accuracy)
                      )}{' '}
                      {b.baseAsset!.name}
                    </td>
                    <td className="_amount">
                      {asBalance(b)} {b.asset.name}
                    </td>
                    <td className="_action">
                      {(assetsAvailableForDeposit.find(
                        asset => asset.id === b.assetId
                      ) ||
                        !wallet.isTrading) && (
                        <Dropdown trigger="click">
                          <DropdownControl>
                            <button type="button" className="btn btn--icon">
                              <i className="icon icon--actions" />
                            </button>
                          </DropdownControl>
                          <DropdownContainer>
                            <DropdownList className="asset-menu">
                              {wallet.isTrading ? (
                                [
                                  <DropdownListItem
                                    isCategory={true}
                                    key="Deposit"
                                  >
                                    {labels.Deposit}
                                  </DropdownListItem>,
                                  <DropdownListItem
                                    key="Credit Card"
                                    className={classnames({
                                      disabled: !isKycPassed
                                    })}
                                  >
                                    {isKycPassed ? (
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
                                        {labels.CreditCard}
                                      </Link>
                                    ) : (
                                      <a>
                                        <img
                                          className="icon"
                                          src={`${process.env
                                            .PUBLIC_URL}/images/paymentMethods/deposit-credit-card.svg`}
                                        />
                                        {labels.CreditCard}
                                      </a>
                                    )}
                                  </DropdownListItem>
                                ]
                              ) : (
                                <DropdownListItem>
                                  <Link
                                    to={ROUTE_TRANSFER_FROM(
                                      wallet.id,
                                      b.assetId
                                    )}
                                  >
                                    {labels.Transfer}
                                  </Link>
                                </DropdownListItem>
                              )}
                            </DropdownList>
                          </DropdownContainer>
                        </Dropdown>
                      )}
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

export default inject(({rootStore}: {rootStore: RootStore}) => ({
  assetsAvailableForDeposit: rootStore.assetStore.assetsAvailableForDeposit,
  isKycPassed: rootStore.profileStore.isKycPassed,
  labels: rootStore!.localizationStore.i18nWalletBalanceList
}))(observer(WalletBalanceList));
