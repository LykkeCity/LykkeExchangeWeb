import {action, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import Spinner from '../../components/Spinner';
import TransactionsTable from '../../components/TransactionsTable';
import WalletTabs from '../../components/WalletTabs/index';
import {AnalyticsEvent, Place} from '../../constants/analyticsEvents';
import {ROUTE_WALLETS_TRADING} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {TransactionType} from '../../models';

import './style.css';

export class HistoryPage extends React.Component<RootStoreProps> {
  private readonly transactionStore = this.props.rootStore!.transactionStore;
  private readonly walletStore = this.props.rootStore!.walletStore;
  private readonly analyticsService = this.props.rootStore!.analyticsService;

  @observable private isExportLoading = false;
  private transactionType?: TransactionType[] = [
    TransactionType.CashIn,
    TransactionType.CashOut,
    TransactionType.Trade
  ];

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className="history-page-wrapper">
        <div className="container">
          <WalletTabs activeTabRoute={ROUTE_WALLETS_TRADING} />
          <Link to={ROUTE_WALLETS_TRADING} className="arrow-back">
            <img
              src={`${process.env.PUBLIC_URL}/images/back-icn.svg`}
              alt="Back"
            />
          </Link>
          <div className="history-page">
            <div className="history-page__header">
              <h2 className="history-page__title">History</h2>
              <div
                className="btn-shadow btn-export"
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => this.exportTransactions(this.transactionType)}
              >
                {this.isExportLoading ? (
                  <Spinner />
                ) : (
                  <span>
                    <img
                      src={`${process.env.PUBLIC_URL}/images/export-icn.svg`}
                    />
                    Export to csv
                  </span>
                )}
              </div>
            </div>
            <div className="history-page__wallet-name">Trading wallet</div>
          </div>
        </div>

        <TransactionsTable
          hasAssetLinks
          transactions={this.transactionStore.walletTransactions}
          loadTransactions={this.loadTransactions}
          exportTransactions={this.exportTransactions}
          onTransactionTypeChange={this.handleTransactionTypeChange}
          isExportLoading={this.isExportLoading}
          stickyTitle={this.renderStickyTitle()}
          handleAssetIconClick={this.trackClickAssetIcon}
          handleAssetNameClick={this.trackClickAssetName}
          handleColumnHeaderClick={this.trackClickColumnHeader}
        />
      </div>
    );
  }

  private trackClickAssetIcon = () => {
    this.analyticsService.track(
      AnalyticsEvent.ClickAssetIcon(Place.HistoryPage)
    );
  };

  private trackClickAssetName = () => {
    this.analyticsService.track(
      AnalyticsEvent.ClickAssetName(Place.HistoryPage)
    );
  };

  private trackClickColumnHeader = (name: string) => {
    this.analyticsService.track(
      AnalyticsEvent.ClickColumnHeader(name, Place.HistoryPage)
    );
  };

  private renderStickyTitle = () => (
    <div className="sticky-title">
      <span className="sticky-title__wallet-name">Trading Wallet</span>
    </div>
  );

  private handleTransactionTypeChange = (
    transactionType?: TransactionType[]
  ) => {
    this.transactionType = transactionType;
    this.analyticsService.track(
      AnalyticsEvent.FilterTransactionHistory(
        transactionType ? transactionType.toString() : '',
        Place.HistoryPage
      )
    );
  };

  @action
  private exportTransactions = async (transactionType?: TransactionType[]) => {
    if (!this.isExportLoading) {
      this.analyticsService.track(
        AnalyticsEvent.ExportTransactionHistory(
          transactionType ? transactionType.toString() : '',
          Place.HistoryPage
        )
      );
      this.isExportLoading = true;
      const url = await this.transactionStore.fetchTransactionsCsvUrl(
        transactionType || this.transactionType
      );
      window.location.replace(url);
      this.isExportLoading = false;
    }
  };

  private loadTransactions = async (
    count: number,
    transactionTypes?: TransactionType[]
  ) => {
    await this.walletStore.fetchWalletsData();
    const tradingWallet = this.walletStore.tradingWallets[0];
    if (tradingWallet) {
      await this.transactionStore.fetchWalletTransactions(
        tradingWallet.id,
        0,
        count,
        transactionTypes
      );
    }
  };
}

export default inject(STORE_ROOT)(observer(HistoryPage));
