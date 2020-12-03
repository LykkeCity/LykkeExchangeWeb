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
import {AnalyticsEvent, Place} from '../../constants/analyticsEvents';
import {
  ROUTE_ASSET,
  ROUTE_DEPOSIT_CREDIT_CARD_TO,
  ROUTE_DEPOSIT_CRYPTO_TO,
  ROUTE_DEPOSIT_SWIFT_TO,
  ROUTE_LKK_INVESTMENT,
  ROUTE_TRANSFER_FROM,
  ROUTE_WITHDRAW_CRYPTO_FROM,
  ROUTE_WITHDRAW_SWIFT_FROM
} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models/index';
import {moneyFloor, moneyRound, plural} from '../../utils';
import {asAssetBalance} from '../hoc/assetBalance';
import Spinner from '../Spinner';

import './style.css';

const ASSET_DEFAULT_ICON_URL = `${process.env
  .PUBLIC_URL}/images/assets/asset_default.jpg`;

// tslint:disable-next-line:no-var-requires
const QRCode = require('qrcode.react');

interface WalletBalanceListProps extends RootStoreProps {
  wallet: WalletModel;
  onAssetRowClick?: (assetId: string) => void;
}

export class WalletBalanceList extends React.Component<WalletBalanceListProps> {
  private readonly assetStore = this.props.rootStore!.assetStore;
  private readonly profileStore = this.props.rootStore!.profileStore;
  private readonly uiStore = this.props.rootStore!.uiStore;
  private readonly analyticsService = this.props.rootStore!.analyticsService;

  render() {
    const QR_SIZE = 120;
    const wallet = this.props.wallet;

    if (!wallet.hasBalances) {
      return (
        <div className="wallet__balances">
          <small style={{margin: 0}}>You don’t have any assets yet</small>
        </div>
      );
    }

    const hasReservedBalance = (category: string) => {
      const balances = wallet.getBalancesByCategory[category];
      return balances.some(balance => balance.reserved > 0);
    };

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
              <div className="container-table-assets">
                <table className="table_assets">
                  <thead>
                    <tr>
                      <th
                        className="_asset"
                        // tslint:disable-next-line:jsx-no-lambda
                        onClick={() => this.trackClickColumnHeader('Asset')}
                      >
                        <span>Asset</span>
                      </th>
                      <th
                        className="_reserved"
                        // tslint:disable-next-line:jsx-no-lambda
                        onClick={() => this.trackClickColumnHeader('In order')}
                      >
                        {hasReservedBalance(x) && 'In order'}
                      </th>
                      <th
                        className="_currency"
                        // tslint:disable-next-line:jsx-no-lambda
                        onClick={() =>
                          this.trackClickColumnHeader('Base currency')}
                      >
                        Base currency
                      </th>
                      <th
                        className="_amount"
                        // tslint:disable-next-line:jsx-no-lambda
                        onClick={() => this.trackClickColumnHeader('Amount')}
                      >
                        Amount
                      </th>
                      <th className="_action">&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {balances.map(balance => (
                      <tr
                        className={classnames({
                          hidden:
                            moneyRound(
                              balance.balance,
                              balance.asset!.accuracy
                            ) === 0
                        })}
                        key={balance.assetId + balance.balance}
                        // tslint:disable-next-line:jsx-no-lambda
                        onClick={() =>
                          this.props.onAssetRowClick!(balance.assetId)}
                      >
                        <td className="_asset">
                          <div className="issuer">
                            <div className="issuer__img">
                              <img
                                src={
                                  balance.asset.iconUrl ||
                                  ASSET_DEFAULT_ICON_URL
                                }
                                onClick={this.trackClickAssetIcon}
                                alt="asset"
                                width={48}
                                height={48}
                              />
                            </div>
                            <div className="issuer__content">
                              <div className="issuer__name">
                                {wallet.isTrading ? (
                                  <Link
                                    to={ROUTE_ASSET(balance.assetId)}
                                    onClick={this.trackClickAssetName}
                                  >
                                    {balance.asset.name}
                                  </Link>
                                ) : (
                                  <span onClick={this.trackClickAssetName}>
                                    {balance.asset.name}
                                  </span>
                                )}
                                {balance.reserved > 0 && (
                                  <div className="reserved_responsive">
                                    In order: {balance.asset!.name}{' '}
                                    {asAssetBalance(
                                      balance.asset,
                                      moneyRound(
                                        balance.reserved,
                                        balance.asset!.accuracy
                                      )
                                    )}
                                  </div>
                                )}
                                {this.isAvailableForCryptoDeposit(
                                  balance.assetId
                                ) &&
                                  wallet.isTrading &&
                                  this.profileStore.isKycPassed && (
                                    <div
                                      className="qr"
                                      // tslint:disable-next-line:jsx-no-lambda
                                      onMouseOver={() =>
                                        this.handleQrMouseOver(balance.assetId)}
                                      // tslint:disable-next-line:jsx-no-lambda
                                      onClick={(e: any) =>
                                        this.handleQrClick(e, balance.assetId)}
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
                                                    balance.asset
                                                      .addressExtension
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
                        <td className="_reserved">
                          {balance.reserved > 0 &&
                            asAssetBalance(
                              balance.asset,
                              moneyRound(
                                balance.reserved,
                                balance.asset!.accuracy
                              )
                            )}{' '}
                          {balance.reserved > 0 && balance.asset!.name}
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
                          {moneyFloor(
                            balance.balance,
                            balance.asset.accuracy
                          )}{' '}
                          {balance.asset.name}
                        </td>
                        <td className="_amount_responsive">
                          <div className="_amount_responsive__asset">
                            {balance.asset.name}{' '}
                            {moneyFloor(
                              balance.balance,
                              balance.asset.accuracy
                            )}
                          </div>
                          <div className="_amount_responsive__base_asset">
                            {balance.baseAsset!.name}{' '}
                            {asAssetBalance(
                              balance.baseAsset!,
                              moneyRound(
                                balance.balanceInBaseAsset,
                                balance.baseAsset!.accuracy
                              )
                            )}
                          </div>
                        </td>
                        <td
                          className="_action"
                          // tslint:disable-next-line:jsx-no-lambda
                          onClick={(e: any) => e.stopPropagation()}
                        >
                          {(this.isAvailableForDeposit(balance.assetId) ||
                            this.isAvailableForWithdraw(balance.assetId) ||
                            !wallet.isTrading) && (
                            <Dropdown>
                              <DropdownControl>
                                <button
                                  onClick={this.trackClickAssetActionsMenu}
                                  type="button"
                                  className="btn btn--icon"
                                >
                                  <span className="icon_dot">&nbsp;</span>
                                  <span className="icon_dot">&nbsp;</span>
                                  <span className="icon_dot">&nbsp;</span>
                                </button>
                              </DropdownControl>
                              <DropdownContainer className="actions">
                                <DropdownList className="asset-menu">
                                  {wallet.isTrading &&
                                    this.isAvailableForDeposit(
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
                                            .PUBLIC_URL}/images/paymentMethods/deposit-credit-card.svg`,
                                          balance.assetId
                                        ),
                                      this.isAvailableForCryptoDeposit(
                                        balance.assetId
                                      ) &&
                                        this.renderMenuItem(
                                          'Blockchain Transfer',
                                          ROUTE_DEPOSIT_CRYPTO_TO(
                                            balance.assetId
                                          ),
                                          `${process.env
                                            .PUBLIC_URL}/images/paymentMethods/deposit-bl-transfer-icn.svg`,
                                          balance.assetId
                                        ),
                                      this.isAvailableForSwiftDeposit(
                                        balance.assetId
                                      ) &&
                                        this.renderMenuItem(
                                          'SWIFT',
                                          ROUTE_DEPOSIT_SWIFT_TO(
                                            balance.assetId
                                          ),
                                          `${process.env
                                            .PUBLIC_URL}/images/paymentMethods/deposit-swift-icn.svg`,
                                          balance.assetId
                                        )
                                    ]}
                                  {wallet.isTrading &&
                                    this.isAvailableForWithdraw(
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
                                            .PUBLIC_URL}/images/paymentMethods/withdraw-bl-transfer-icn.svg`,
                                          balance.assetId
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
                                            .PUBLIC_URL}/images/paymentMethods/withdraw-swift-icn.svg`,
                                          balance.assetId
                                        )
                                    ]}
                                  {wallet.isTrading &&
                                    this.isAvailableForInvestmentRound(
                                      balance.assetId
                                    ) && [
                                      <DropdownListItem
                                        isCategory={true}
                                        key="Invest"
                                      >
                                        Invest
                                      </DropdownListItem>,
                                      this.renderMenuItem(
                                        'Investment Round',
                                        ROUTE_LKK_INVESTMENT,
                                        `${process.env
                                          .PUBLIC_URL}/images/paymentMethods/deposit-credit-card.svg`,
                                        balance.assetId
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

  private renderMenuItem = (
    label: string,
    route: string,
    iconUrl: string,
    assetId: string
  ) => (
    <DropdownListItem
      key={label}
      className={classnames({
        disabled: !this.profileStore.isKycPassed
      })}
    >
      {this.profileStore.isKycPassed ? (
        <Link
          to={route}
          // tslint:disable-next-line:jsx-no-lambda
          onClick={() =>
            route.includes('deposit')
              ? this.trackStartDeposit(label, assetId)
              : this.trackStartWithdraw(label, assetId)}
        >
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

  private trackClickAssetActionsMenu = () => {
    this.analyticsService.track(AnalyticsEvent.ClickAssetActionsMenu);
  };

  private trackClickAssetIcon = () => {
    this.analyticsService.track(
      AnalyticsEvent.ClickAssetIcon(Place.WalletPage)
    );
  };

  private trackClickAssetName = () => {
    this.analyticsService.track(
      AnalyticsEvent.ClickAssetName(Place.WalletPage)
    );
  };

  private trackClickAssetQR = () => {
    this.analyticsService.track(AnalyticsEvent.ClickAssetQR);
  };

  private trackClickColumnHeader = (name: string) => {
    this.analyticsService.track(
      AnalyticsEvent.ClickColumnHeader(name, Place.WalletPage)
    );
  };

  private trackHoverAssetQR = () => {
    this.analyticsService.track(AnalyticsEvent.HoverAssetQR);
  };

  private trackStartDeposit = (type: string, assetId: string) => {
    this.analyticsService.track(
      AnalyticsEvent.StartDeposit(Place.WalletBalanceMenu, type, assetId)
    );
  };

  private trackStartWithdraw = (type: string, assetId: string) => {
    this.analyticsService.track(
      AnalyticsEvent.StartWithdraw(Place.WalletBalanceMenu, type, assetId)
    );
  };

  private handleQrMouseOver = (assetId: string) => {
    const asset = this.assetStore!.getById(assetId);
    if (asset && !asset.address) {
      this.assetStore!.fetchAddress(assetId);
    }

    this.trackHoverAssetQR();
  };

  @action
  private handleQrClick = (e: any, assetId: string) => {
    e.stopPropagation();
    this.uiStore.showAssetAddressModal = true;
    this.assetStore.selectedAsset = this.assetStore!.getById(assetId);

    this.trackClickAssetQR();
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

  private isAvailableForInvestmentRound = (assetId: string) =>
    assetId === 'LKK';
}

export default inject(STORE_ROOT)(observer(WalletBalanceList));
