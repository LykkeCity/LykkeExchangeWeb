import {inject, observer} from 'mobx-react';
import React from 'react';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import TransactionsTable from '../../components/TransactionsTable';
import WalletTabs from '../../components/WalletTabs/index';
import {ROUTE_WALLETS_TRADING} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {TransactionType} from '../../models';

import './style.css';

export class HistoryPage extends React.Component<RootStoreProps> {
  private readonly transactionStore = this.props.rootStore!.transactionStore;
  private readonly walletStore = this.props.rootStore!.walletStore;

  private isExportLoading = false;
  private transactionType?: TransactionType[] = [];

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
            <h2 className="history-page__title">
              History
              <span
                className="pull-right btn-shadow btn-export"
                // tslint:disable-next-line:jsx-no-lambda
                onClick={() => this.exportTransactions()}
              >
                <img src={`${process.env.PUBLIC_URL}/images/export-icn.svg`} />
                Export to csv
              </span>
            </h2>
            <div className="history-page__wallet-name">Trading wallet</div>
          </div>
        </div>

        <TransactionsTable
          transactions={this.transactionStore.walletTransactions}
          loadTransactions={this.loadTransactions}
          exportTransactions={this.exportTransactions}
          onTransactionTypeChange={this.handleTransactionTypeChange}
          stickyTitle={this.renderStickyTitle()}
        />
      </div>
    );
  }

  private renderStickyTitle = () => (
    <div className="sticky-title">
      <span className="sticky-title__wallet-name">Trading Wallet</span>
    </div>
  );

  private handleTransactionTypeChange = (
    transactionType?: TransactionType[]
  ) => {
    this.transactionType = transactionType;
  };

  private exportTransactions = async (transactionType?: TransactionType[]) => {
    if (!this.isExportLoading) {
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
