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
  ROUTE_DEPOSIT_CRYPTO_TO,
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
  assetsAvailableForCreditCardDeposit?: AssetModel[];
  assetsAvailableForCryptoDeposit?: AssetModel[];
}

export const WalletBalanceList: React.SFC<WalletBalanceListProps> = ({
  wallet,
  isKycPassed,
  assetsAvailableForCreditCardDeposit = [],
  assetsAvailableForCryptoDeposit = []
}) => {
  const isAvailableForCreditCardDeposit = (assetId: string) =>
    assetsAvailableForCreditCardDeposit.find(asset => asset.id === assetId);
  const isAvailableForCryptoDeposit = (assetId: string) =>
    assetsAvailableForCryptoDeposit.find(asset => asset.id === assetId);

  const depositCreditCardMenuItem = (assetId: string) => (
    <DropdownListItem
      key="Credit Card"
      className={classnames({
        disabled: !isKycPassed
      })}
    >
      {isKycPassed ? (
        <Link to={ROUTE_DEPOSIT_CREDIT_CARD_TO(wallet.id, assetId)}>
          <img
            className="icon"
            src={`${process.env
              .PUBLIC_URL}/images/paymentMethods/deposit-credit-card.svg`}
          />
          Credit Card
        </Link>
      ) : (
        <a>
          <img
            className="icon"
            src={`${process.env
              .PUBLIC_URL}/images/paymentMethods/deposit-credit-card.svg`}
          />
          Credit Card
        </a>
      )}
    </DropdownListItem>
  );

  const depositCryptoMenuItem = (assetId: string) => (
    <DropdownListItem key="Crypto">
      <Link to={ROUTE_DEPOSIT_CRYPTO_TO(assetId)}>
        <img
          className="icon"
          src={`${process.env
            .PUBLIC_URL}/images/paymentMethods/deposit-bl-transfer-icn.svg`}
        />
        Blockchain Transfer
      </Link>
    </DropdownListItem>
  );

  return (
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
                    <th className="_asset">
                      <span>Asset</span>
                    </th>
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
                            <div className="issuer__name">
                              {wallet.isTrading ? (
                                <Link to={ROUTE_ASSET(b.assetId)}>
                                  {b.asset.name}
                                </Link>
                              ) : (
                                b.asset.name
                              )}
                              {isAvailableForCryptoDeposit(b.assetId) && (
                                <span className="qr-icn">
                                  <Link to={ROUTE_DEPOSIT_CRYPTO_TO(b.assetId)}>
                                    <img
                                      className="icon"
                                      src={`${process.env
                                        .PUBLIC_URL}/images/qr-icn.svg`}
                                    />
                                  </Link>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="_currency">
                        {asAssetBalance(
                          b.baseAsset!,
                          moneyFloor(
                            b.balanceInBaseAsset,
                            b.baseAsset!.accuracy
                          )
                        )}{' '}
                        {b.baseAsset!.name}
                      </td>
                      <td className="_amount">
                        {asBalance(b)} {b.asset.name}
                      </td>
                      <td className="_action">
                        {(isAvailableForCreditCardDeposit(b.assetId) ||
                          isAvailableForCryptoDeposit(b.assetId) ||
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
                                      Deposit
                                    </DropdownListItem>,
                                    isAvailableForCreditCardDeposit(
                                      b.assetId
                                    ) && depositCreditCardMenuItem(b.assetId),
                                    isAvailableForCryptoDeposit(b.assetId) &&
                                      depositCryptoMenuItem(b.assetId)
                                  ]
                                ) : (
                                  <DropdownListItem>
                                    <Link
                                      to={ROUTE_TRANSFER_FROM(
                                        wallet.id,
                                        b.assetId
                                      )}
                                    >
                                      Transfer
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
};

export default inject(({rootStore}: {rootStore: RootStore}) => ({
  assetsAvailableForCreditCardDeposit:
    rootStore.assetStore.assetsAvailableForCreditCardDeposit,
  assetsAvailableForCryptoDeposit:
    rootStore.assetStore.assetsAvailableForCryptoDeposit,
  isKycPassed: rootStore.profileStore.isKycPassed
}))(observer(WalletBalanceList));
