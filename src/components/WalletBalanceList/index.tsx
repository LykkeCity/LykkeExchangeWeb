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
  ROUTE_DEPOSIT_SWIFT_TO,
  ROUTE_TRANSFER_FROM
} from '../../constants/routes';
import {AssetModel, WalletModel} from '../../models/index';
import {AssetStore, RootStore} from '../../stores';
import {moneyRound, plural} from '../../utils';
import {asAssetBalance, asBalance} from '../hoc/assetBalance';
import Spinner from '../Spinner';

import './style.css';

const ASSET_DEFAULT_ICON_URL = `${process.env
  .PUBLIC_URL}/images/assets/asset_default.jpg`;

// tslint:disable-next-line:no-var-requires
const QRCode = require('qrcode.react');

interface WalletBalanceListProps {
  wallet: WalletModel;
  isKycPassed?: boolean;
  assetStore?: AssetStore;
  assetsAvailableForCreditCardDeposit?: AssetModel[];
  assetsAvailableForSwiftDeposit?: AssetModel[];
  assetsAvailableForCryptoDeposit?: AssetModel[];
}

export const WalletBalanceList: React.SFC<WalletBalanceListProps> = ({
  wallet,
  isKycPassed,
  assetStore,
  assetsAvailableForCreditCardDeposit = [],
  assetsAvailableForSwiftDeposit = [],
  assetsAvailableForCryptoDeposit = []
}) => {
  const isAvailableForCreditCardDeposit = (assetId: string) =>
    assetsAvailableForCreditCardDeposit.find(asset => asset.id === assetId);
  const isAvailableForCryptoDeposit = (assetId: string) =>
    assetsAvailableForCryptoDeposit.find(asset => asset.id === assetId);
  const isAvailableForSwiftDeposit = (assetId: string) =>
    assetsAvailableForSwiftDeposit.find(asset => asset.id === assetId);

  const QR_SIZE = 120;

  const renderDepositMenuItem = (
    label: string,
    route: string,
    iconUrl: string
  ) => (
    <DropdownListItem
      key={label}
      className={classnames({
        disabled: !isKycPassed
      })}
    >
      {isKycPassed ? (
        <Link to={route}>
          <img className="icon" src={iconUrl} />
          {label}
        </Link>
      ) : (
        <a>
          <img className="icon" src={iconUrl} />
          {label}
        </a>
      )}
    </DropdownListItem>
  );

  const handleQrOpen = (assetId: string) => {
    const asset = assetStore!.getById(assetId);
    if (asset && !asset.address) {
      assetStore!.fetchAddress(assetId);
    }
  };

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
                  {balances.map(balance => (
                    <tr key={balance.assetId + balance.balance}>
                      <td className="_asset">
                        <div className="issuer">
                          <div className="issuer__img">
                            <img
                              src={
                                balance.asset.iconUrl || ASSET_DEFAULT_ICON_URL
                              }
                              alt="asset"
                              width={48}
                              height={48}
                            />
                          </div>
                          <div className="issuer__content">
                            <div className="issuer__name">
                              {wallet.isTrading ? (
                                <Link to={ROUTE_ASSET(balance.assetId)}>
                                  {balance.asset.name}
                                </Link>
                              ) : (
                                balance.asset.name
                              )}
                              {isAvailableForCryptoDeposit(balance.assetId) &&
                                isKycPassed &&
                                !assetStore!.isEth(balance.assetId) && (
                                  <div
                                    className="pull-right"
                                    // tslint:disable-next-line:jsx-no-lambda
                                    onMouseOver={() =>
                                      handleQrOpen(balance.assetId)}
                                  >
                                    <Dropdown>
                                      <DropdownControl>
                                        <span className="qr-icn">
                                          <img
                                            className="icon"
                                            src={`${process.env
                                              .PUBLIC_URL}/images/qr-icn.svg`}
                                          />
                                        </span>
                                      </DropdownControl>
                                      <DropdownContainer>
                                        <div className="asset-address">
                                          {balance.asset.addressExtension ? (
                                            <div>
                                              <QRCode
                                                size={QR_SIZE}
                                                value={
                                                  balance.asset.addressBase
                                                }
                                              />
                                              <div className="asset-address-label">
                                                Address
                                              </div>
                                              <QRCode
                                                size={QR_SIZE}
                                                value={
                                                  balance.asset.addressExtension
                                                }
                                              />
                                              <div className="asset-address-label">
                                                Tag
                                              </div>
                                            </div>
                                          ) : balance.asset.address ? (
                                            <div>
                                              <QRCode
                                                size={QR_SIZE}
                                                value={balance.asset.address}
                                              />
                                              <div className="asset-address-label">
                                                Scan to get the address
                                              </div>
                                            </div>
                                          ) : (
                                            <Spinner />
                                          )}
                                        </div>
                                      </DropdownContainer>
                                    </Dropdown>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="_currency">
                        {asAssetBalance(
                          balance.baseAsset!,
                          moneyRound(
                            balance.balanceInBaseAsset,
                            balance.baseAsset!.accuracy
                          )
                        )}{' '}
                        {balance.baseAsset!.name}
                      </td>
                      <td className="_amount">
                        {asBalance(balance)} {balance.asset.name}
                      </td>
                      <td className="_action">
                        {(isAvailableForCreditCardDeposit(balance.assetId) ||
                          isAvailableForSwiftDeposit(balance.assetId) ||
                          isAvailableForCryptoDeposit(balance.assetId) ||
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
                                      balance.assetId
                                    ) &&
                                      renderDepositMenuItem(
                                        'Credit Card',
                                        ROUTE_DEPOSIT_CREDIT_CARD_TO(
                                          wallet.id,
                                          balance.assetId
                                        ),
                                        `${process.env
                                          .PUBLIC_URL}/images/paymentMethods/deposit-credit-card.svg`
                                      ),
                                    isAvailableForCryptoDeposit(
                                      balance.assetId
                                    ) &&
                                      renderDepositMenuItem(
                                        'Blockchain Transfer',
                                        ROUTE_DEPOSIT_CRYPTO_TO(
                                          balance.assetId
                                        ),
                                        `${process.env
                                          .PUBLIC_URL}/images/paymentMethods/deposit-bl-transfer-icn.svg`
                                      ),
                                    isAvailableForSwiftDeposit(
                                      balance.assetId
                                    ) &&
                                      renderDepositMenuItem(
                                        'SWIFT',
                                        ROUTE_DEPOSIT_SWIFT_TO(balance.assetId),
                                        `${process.env
                                          .PUBLIC_URL}/images/paymentMethods/deposit-swift-icn.svg`
                                      )
                                  ]
                                ) : (
                                  <DropdownListItem>
                                    <Link
                                      to={ROUTE_TRANSFER_FROM(
                                        wallet.id,
                                        balance.assetId
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
  assetStore: rootStore.assetStore,
  assetsAvailableForCreditCardDeposit:
    rootStore.assetStore.assetsAvailableForCreditCardDeposit,
  assetsAvailableForCryptoDeposit:
    rootStore.assetStore.assetsAvailableForCryptoDeposit,
  assetsAvailableForSwiftDeposit:
    rootStore.assetStore.assetsAvailableForSwiftDeposit,
  isKycPassed: rootStore.profileStore.isKycPassed
}))(observer(WalletBalanceList));
