import {action, computed, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import TransactionsTable from '../../components/TransactionsTable';
import WalletTabs from '../../components/WalletTabs/index';
import {AnalyticsEvent, Place} from '../../constants/analyticsEvents';
import {
  ROUTE_DEPOSIT_CREDIT_CARD_TO,
  ROUTE_DEPOSIT_CRYPTO_TO,
  ROUTE_DEPOSIT_SWIFT_TO,
  ROUTE_WALLETS_TRADING,
  ROUTE_WITHDRAW_CRYPTO_FROM,
  ROUTE_WITHDRAW_SWIFT_FROM
} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {AssetModel, BalanceModel, TransactionType} from '../../models';
import {moneyFloor} from '../../utils';

// tslint:disable-next-line:no-var-requires
const QRCode = require('qrcode.react');

import './style.css';

interface AssetPageProps extends RootStoreProps, RouteComponentProps<any> {}

export class AssetPage extends React.Component<AssetPageProps> {
  private readonly assetStore = this.props.rootStore!.assetStore;
  private readonly transactionStore = this.props.rootStore!.transactionStore;
  private readonly walletStore = this.props.rootStore!.walletStore;
  private readonly profileStore = this.props.rootStore!.profileStore;
  private readonly analyticsService = this.props.rootStore!.analyticsService;

  @observable private isExportLoading = false;

  @computed
  get isAvailableForCreditCardDeposit() {
    const {assetId} = this.props.match.params;
    return this.assetStore.assetsAvailableForCreditCardDeposit.find(
      asset => assetId === asset.id
    );
  }

  @computed
  get isAvailableForCryptoDeposit() {
    const {assetId} = this.props.match.params;
    return this.assetStore.assetsAvailableForCryptoDeposit.find(
      asset => assetId === asset.id
    );
  }

  @computed
  get isAvailableForSwiftDeposit() {
    const {assetId} = this.props.match.params;
    return this.assetStore.assetsAvailableForSwiftDeposit.find(
      asset => assetId === asset.id
    );
  }

  @computed
  get isAvailableForCryptoWithdraw() {
    const {assetId} = this.props.match.params;
    return this.assetStore.assetsAvailableForCryptoWithdraw.find(
      asset => assetId === asset.id
    );
  }

  @computed
  get isAvailableForSwiftWithdraw() {
    const {assetId} = this.props.match.params;
    return this.assetStore.assetsAvailableForSwiftWithdraw.find(
      asset => assetId === asset.id
    );
  }

  componentDidMount() {
    const {assetId} = this.props.match.params;
    this.assetStore.fetchAddress(assetId);

    window.scrollTo(0, 0);
  }

  render() {
    const {assetId} = this.props.match.params;
    const asset = this.assetStore.getById(assetId) || new AssetModel();
    const wallet = this.walletStore.tradingWallets[0];
    const balance = wallet && wallet.balances.find(b => b.assetId === assetId);
    const QR_SIZE = 120;

    return (
      <div className="asset-page-wrapper">
        <div className="container">
          <WalletTabs activeTabRoute={ROUTE_WALLETS_TRADING} />
          <Link to={ROUTE_WALLETS_TRADING} className="arrow-back">
            <img
              src={`${process.env.PUBLIC_URL}/images/back-icn.svg`}
              alt="Back"
            />
          </Link>
          <div className="asset-page">
            <div className="asset-page__header">
              <div className="asset-page__info">
                <h2 className="asset-page__name">{asset.name}</h2>
                {balance && (
                  <span className="asset-page__amount">
                    {moneyFloor(balance.balance, balance.asset.accuracy)}{' '}
                    {balance.asset.name}
                  </span>
                )}
                <div className="asset-page__description">
                  {asset.description}
                </div>
              </div>
              {asset.addressBase && asset.addressExtension ? (
                <div
                  className="asset-page__addresses"
                  title={`Scan both address and tag to deposit ${asset.name}.`}
                >
                  <div className="asset-page__address">
                    <QRCode size={QR_SIZE} value={asset.addressBase} />
                    <div className="asset-page__address-tip">Address</div>
                  </div>
                  <div className="asset-page__address">
                    <QRCode size={QR_SIZE} value={asset.addressExtension} />
                    <div className="asset-page__address-tip">Tag</div>
                  </div>
                </div>
              ) : (
                asset.address && (
                  <div
                    className="asset-page__address"
                    onClick={this.trackClickQrArea}
                  >
                    <QRCode size={QR_SIZE} value={asset.address} />
                    <div className="asset-page__address-tip">
                      Scan to Deposit
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="asset-page__actions">
              {(this.isAvailableForCreditCardDeposit ||
                this.isAvailableForCryptoDeposit ||
                this.isAvailableForSwiftDeposit) && (
                <ul className="action-list">
                  <li className="action-list__title">Deposit</li>
                  {this.isAvailableForCreditCardDeposit &&
                    this.renderMenuItem(
                      ROUTE_DEPOSIT_CREDIT_CARD_TO(wallet.id, asset.id),
                      `${process.env
                        .PUBLIC_URL}/images/paymentMethods/deposit-credit-card.svg`,
                      'Credit Card',
                      asset.id
                    )}
                  {this.isAvailableForCryptoDeposit &&
                    this.renderMenuItem(
                      ROUTE_DEPOSIT_CRYPTO_TO(asset.id),
                      `${process.env
                        .PUBLIC_URL}/images/paymentMethods/deposit-bl-transfer-icn.svg`,
                      'Blockchain Transfer',
                      asset.id
                    )}
                  {this.isAvailableForSwiftDeposit &&
                    this.renderMenuItem(
                      ROUTE_DEPOSIT_SWIFT_TO(asset.id),
                      `${process.env
                        .PUBLIC_URL}/images/paymentMethods/deposit-swift-icn.svg`,
                      'SWIFT',
                      asset.id
                    )}
                </ul>
              )}
              {(this.isAvailableForCryptoWithdraw ||
                this.isAvailableForSwiftWithdraw) && (
                <ul className="action-list">
                  <li className="action-list__title">Withdraw</li>
                  {this.isAvailableForCryptoWithdraw &&
                    this.renderMenuItem(
                      ROUTE_WITHDRAW_CRYPTO_FROM(asset.id),
                      `${process.env
                        .PUBLIC_URL}/images/paymentMethods/withdraw-bl-transfer-icn.svg`,
                      'Blockchain Transfer',
                      asset.id
                    )}
                  {this.isAvailableForSwiftWithdraw &&
                    this.renderMenuItem(
                      ROUTE_WITHDRAW_SWIFT_FROM(asset.id),
                      `${process.env
                        .PUBLIC_URL}/images/paymentMethods/withdraw-swift-icn.svg`,
                      'SWIFT',
                      asset.id
                    )}
                </ul>
              )}
              <ul className="action-list">
                <li className="action-list__title">Trading</li>
                <li className="action-list__item">
                  <a
                    href={
                      process.env.REACT_APP_TRADE_URL ||
                      'http://trade.lykke.com'
                    }
                    onClick={this.trackGoToTrade}
                    target="_blank"
                  >
                    <img
                      className="icon"
                      src={`${process.env.PUBLIC_URL}/images/trade-icn.svg`}
                    />
                    Trade
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <TransactionsTable
          transactions={this.transactionStore.assetTransactions}
          loadTransactions={this.loadTransactions}
          exportTransactions={this.exportTransactions}
          stickyTitle={this.renderStickyTitle(balance)}
          onTransactionTypeChange={this.handleTransactionTypeChange}
          isExportLoading={this.isExportLoading}
          showExportButton
          handleAssetIconClick={this.trackClickAssetIcon}
          handleAssetNameClick={this.trackClickAssetName}
          handleColumnHeaderClick={this.trackClickColumnHeader}
        />
      </div>
    );
  }

  private trackStartDeposit = (type: string, assetId: string) => {
    this.analyticsService.track(
      AnalyticsEvent.StartDeposit(Place.AssetPage, type, assetId)
    );
  };

  private trackStartWithdraw = (type: string, assetId: string) => {
    this.analyticsService.track(
      AnalyticsEvent.StartWithdraw(Place.AssetPage, type, assetId)
    );
  };

  private trackClickAssetIcon = () => {
    this.analyticsService.track(AnalyticsEvent.ClickAssetIcon(Place.AssetPage));
  };

  private trackClickAssetName = () => {
    this.analyticsService.track(AnalyticsEvent.ClickAssetName(Place.AssetPage));
  };

  private trackClickQrArea = () => {
    this.analyticsService.track(AnalyticsEvent.ClickAssetPageQrArea);
  };

  private trackClickColumnHeader = (name: string) => {
    this.analyticsService.track(
      AnalyticsEvent.ClickColumnHeader(name, Place.AssetPage)
    );
  };

  private trackGoToTrade = () => {
    this.analyticsService.track(AnalyticsEvent.GoToTrade);
  };

  private handleTransactionTypeChange = (
    transactionType?: TransactionType[]
  ) => {
    this.analyticsService.track(
      AnalyticsEvent.FilterTransactionHistory(
        transactionType ? transactionType.toString() : '',
        Place.AssetPage
      )
    );
  };

  private renderStickyTitle = (balance?: BalanceModel) => (
    <div className="sticky-title">
      <h2 className="sticky-title__name">{balance && balance.asset.name}</h2>
      {balance && (
        <span className="sticky-title__amount">
          {moneyFloor(balance.balance, balance.asset.accuracy)}{' '}
          {balance.asset.name}
        </span>
      )}
    </div>
  );

  private renderMenuItem = (
    route: string,
    iconUrl: string,
    label: string,
    assetId: string
  ) =>
    this.profileStore.isKycPassed ? (
      <li className="action-list__item">
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
      </li>
    ) : (
      <li className="action-list__item">
        <a className="disabled">
          <img className="icon" src={iconUrl} />
          {label}
        </a>
      </li>
    );

  @action
  private exportTransactions = async (transactionType?: TransactionType[]) => {
    if (!this.isExportLoading) {
      this.analyticsService.track(
        AnalyticsEvent.ExportTransactionHistory(
          transactionType ? transactionType.toString() : '',
          Place.AssetPage
        )
      );
      this.isExportLoading = true;
      const {assetId} = this.props.match.params;
      const url = await this.transactionStore.fetchTransactionsCsvUrl(
        transactionType,
        assetId
      );
      window.location.replace(url);
      this.isExportLoading = false;
    }
  };

  private loadTransactions = async (
    count: number,
    transactionTypes?: TransactionType[]
  ) => {
    const {assetId} = this.props.match.params;
    const tradingWallet = this.walletStore.tradingWallets[0];
    if (tradingWallet && assetId) {
      await this.transactionStore.fetchAssetTransactions(
        tradingWallet.id,
        assetId,
        0,
        count,
        transactionTypes
      );
    }
  };
}

export default inject(STORE_ROOT)(observer(AssetPage));
