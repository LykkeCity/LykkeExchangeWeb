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

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div>
        <div className="container">
          <WalletTabs activeTabRoute={ROUTE_WALLETS_TRADING} />
          <Link to={ROUTE_WALLETS_TRADING} className="arrow-back">
            <img
              src={`${process.env.PUBLIC_URL}/images/back-icn.svg`}
              alt="Back"
            />
          </Link>
          <div className="history-page">
            <h2 className="history-page__title">History</h2>
            <div className="history-page__wallet-name">Trading wallet</div>
          </div>
        </div>

        <TransactionsTable
          transactions={this.transactionStore.walletTransactions}
          loadTransactions={this.loadTransactions}
          stickyTitle={
            <div className="sticky-title">
              <span className="sticky-title__wallet-name">Trading Wallet</span>
            </div>
          }
        />
      </div>
    );
  }

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
