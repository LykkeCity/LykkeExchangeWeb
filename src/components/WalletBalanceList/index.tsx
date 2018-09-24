import {
  Dialog,
  Dropdown,
  DropdownContainer,
  DropdownControl,
  DropdownList,
  DropdownListItem
} from '@lykkex/react-components';
import classnames from 'classnames';
import {action} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {
  ROUTE_ASSET,
  ROUTE_DEPOSIT_CREDIT_CARD_TO,
  ROUTE_DEPOSIT_CRYPTO_TO,
  ROUTE_DEPOSIT_SWIFT_TO,
  ROUTE_TRANSFER_FROM,
  ROUTE_WITHDRAW_CRYPTO_FROM,
  ROUTE_WITHDRAW_SWIFT_FROM
} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models/index';
import {moneyRound, plural} from '../../utils';
import {asAssetBalance, asBalance} from '../hoc/assetBalance';
import Spinner from '../Spinner';

import './style.css';

const ASSET_DEFAULT_ICON_URL = `${process.env
  .PUBLIC_URL}/images/assets/asset_default.jpg`;

// tslint:disable-next-line:no-var-requires
const QRCode = require('qrcode.react');

interface WalletBalanceListProps extends RootStoreProps {
  wallet: WalletModel;
}

export class WalletBalanceList extends React.Component<WalletBalanceListProps> {
  private readonly assetStore = this.props.rootStore!.assetStore;
  private readonly profileStore = this.props.rootStore!.profileStore;
  private readonly uiStore = this.props.rootStore!.uiStore;

  render() {
    const QR_SIZE = 120;
    const wallet = this.props.wallet;

    if (!wallet.hasBalances) {
      return (
        <div className="wallet__balances">
          <small style={{margin: 0}}>You don’t have any asset yet</small>
        </div>
      );
    }

    return (
      <div className="wallet__balances">
        <Dialog
          className="asset-address-modal"
          visible={this.uiStore.showAssetAddressModal}
          onCancel={this.handleCloseAssetAddressModal}
          confirmButton={{text: ''}}
          cancelButton={{text: ''}}
          title=""
          description={this.renderAssetAddressModal()}
        />
        {Object.keys(wallet.getBalancesByCategory).map(x => {
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
                              {this.isAvailableForCryptoDeposit(
                                balance.assetId
                              ) &&
                                wallet.isTrading &&
                                this.profileStore.isKycPassed &&
                                !this.assetStore!.isEth(balance.assetId) && (
                                  <div
                                    className="pull-right"
                                    // tslint:disable-next-line:jsx-no-lambda
                                    onMouseOver={() =>
                                      this.handleQrMouseOver(balance.assetId)}
                                    // tslint:disable-next-line:jsx-no-lambda
                                    onClick={() =>
                                      this.handleQrClick(balance.assetId)}
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
                        {(this.isAvailableForDeposit(balance.assetId) ||
                          this.isAvailableForWithdraw(balance.assetId) ||
                          !wallet.isTrading) && (
                          <Dropdown trigger="click">
                            <DropdownControl>
                              <button type="button" className="btn btn--icon">
                                <i className="icon icon--actions" />
                              </button>
                            </DropdownControl>
                            <DropdownContainer>
                              <DropdownList className="asset-menu">
                                {this.isAvailableForDeposit(
                                  balance.assetId
                                ) && [
                                  <DropdownListItem
                                    isCategory={true}
                                    key="Deposit"
                                  >
                                    Deposit
                                  </DropdownListItem>,
                                  this.isAvailableForCreditCardDeposit(
                                    balance.assetId
                                  ) &&
                                    this.renderMenuItem(
                                      'Credit Card',
                                      ROUTE_DEPOSIT_CREDIT_CARD_TO(
                                        wallet.id,
                                        balance.assetId
                                      ),
                                      `${process.env
                                        .PUBLIC_URL}/images/paymentMethods/deposit-credit-card.svg`
                                    ),
                                  this.isAvailableForCryptoDeposit(
                                    balance.assetId
                                  ) &&
                                    this.renderMenuItem(
                                      'Blockchain Transfer',
                                      ROUTE_DEPOSIT_CRYPTO_TO(balance.assetId),
                                      `${process.env
                                        .PUBLIC_URL}/images/paymentMethods/deposit-bl-transfer-icn.svg`
                                    ),
                                  this.isAvailableForSwiftDeposit(
                                    balance.assetId
                                  ) &&
                                    this.renderMenuItem(
                                      'SWIFT',
                                      ROUTE_DEPOSIT_SWIFT_TO(balance.assetId),
                                      `${process.env
                                        .PUBLIC_URL}/images/paymentMethods/deposit-swift-icn.svg`
                                    )
                                ]}
                                {this.isAvailableForWithdraw(
                                  balance.assetId
                                ) && [
                                  <DropdownListItem
                                    isCategory={true}
                                    key="Withdraw"
                                  >
                                    Withdraw
                                  </DropdownListItem>,
                                  this.isAvailableForCryptoWithdraw(
                                    balance.assetId
                                  ) &&
                                    this.renderMenuItem(
                                      'Blockchain Transfer',
                                      ROUTE_WITHDRAW_CRYPTO_FROM(
                                        balance.assetId
                                      ),
                                      `${process.env
                                        .PUBLIC_URL}/images/paymentMethods/deposit-bl-transfer-icn.svg`
                                    ),
                                  this.isAvailableForSwiftWithdraw(
                                    balance.assetId
                                  ) &&
                                    this.renderMenuItem(
                                      'SWIFT',
                                      ROUTE_WITHDRAW_SWIFT_FROM(
                                        balance.assetId
                                      ),
                                      `${process.env
                                        .PUBLIC_URL}/images/paymentMethods/deposit-swift-icn.svg`
                                    )
                                ]}
                                {!wallet.isTrading && (
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
  }

  private renderAssetAddressModal = () => {
    const QR_SIZE = 240;

    return (
      <div className="asset-address-modal">
        {this.assetStore.selectedAsset &&
        this.assetStore.selectedAsset.addressExtension ? (
          <div>
            <div className="asset-address-label">
              {this.assetStore.selectedAsset.addressBase}
            </div>
            <hr />
            <QRCode
              size={QR_SIZE}
              value={this.assetStore.selectedAsset.addressBase}
            />
            <div className="asset-address-label">Address</div>
            <hr />
            <div className="asset-address-label">
              {this.assetStore.selectedAsset.addressExtension}
            </div>
            <hr />
            <QRCode
              size={QR_SIZE}
              value={this.assetStore.selectedAsset.addressExtension}
            />
            <div className="asset-address-label">Tag</div>
          </div>
        ) : this.assetStore.selectedAsset &&
        this.assetStore.selectedAsset.address ? (
          <div>
            <div className="asset-address-label">
              {this.assetStore.selectedAsset.address}
            </div>
            <hr />
            <QRCode
              size={QR_SIZE}
              value={this.assetStore.selectedAsset.address}
            />
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    );
  };

  private renderMenuItem = (label: string, route: string, iconUrl: string) => (
    <DropdownListItem
      key={label}
      className={classnames({
        disabled: !this.profileStore.isKycPassed
      })}
    >
      {this.profileStore.isKycPassed ? (
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

  private handleQrMouseOver = (assetId: string) => {
    const asset = this.assetStore!.getById(assetId);
    if (asset && !asset.address) {
      this.assetStore!.fetchAddress(assetId);
    }
  };

  @action
  private handleQrClick = (assetId: string) => {
    this.uiStore.showAssetAddressModal = true;
    this.assetStore.selectedAsset = this.assetStore!.getById(assetId);
  };

  @action
  private handleCloseAssetAddressModal = () => {
    this.uiStore.showAssetAddressModal = false;
  };

  private isAvailableForCreditCardDeposit = (assetId: string) =>
    this.assetStore.assetsAvailableForCreditCardDeposit.find(
      asset => asset.id === assetId
    );

  private isAvailableForCryptoDeposit = (assetId: string) =>
    this.assetStore.assetsAvailableForCryptoDeposit.find(
      asset => asset.id === assetId
    );

  private isAvailableForSwiftDeposit = (assetId: string) =>
    this.assetStore.assetsAvailableForSwiftDeposit.find(
      asset => asset.id === assetId
    );

  private isAvailableForDeposit = (assetId: string) =>
    this.isAvailableForCreditCardDeposit(assetId) ||
    this.isAvailableForCryptoDeposit(assetId) ||
    this.isAvailableForSwiftDeposit(assetId);

  private isAvailableForSwiftWithdraw = (assetId: string) =>
    this.assetStore.assetsAvailableForSwiftWithdraw.find(
      asset => asset.id === assetId
    );

  private isAvailableForCryptoWithdraw = (assetId: string) =>
    this.assetStore.assetsAvailableForCryptoWithdraw.find(
      asset => asset.id === assetId
    );

  private isAvailableForWithdraw = (assetId: string) =>
    this.isAvailableForSwiftWithdraw(assetId) ||
    this.isAvailableForCryptoWithdraw(assetId);
}

export default inject(STORE_ROOT)(observer(WalletBalanceList));
