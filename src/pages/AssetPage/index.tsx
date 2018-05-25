import classnames from 'classnames';
import {Table} from 'lykke-react-components';
import {observable, reaction} from 'mobx';
import {inject, observer} from 'mobx-react';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import {FormattedDate, FormattedTime} from 'react-intl';
import {Link, RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ColoredAmount} from '../../components/ColoredAmount';
import {asBalance} from '../../components/hoc/assetBalance';
import Spinner from '../../components/Spinner';
import WalletTabs from '../../components/WalletTabs/index';
import {
  ROUTE_DEPOSIT_CREDIT_CARD_TO,
  ROUTE_WALLETS_TRADING
} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {
  AssetModel,
  TransactionStatusLabel,
  TransactionType,
  TransactionTypeLabel
} from '../../models';
import {arraysEqual} from '../../utils';

import './style.css';

interface AssetPageProps extends RootStoreProps, RouteComponentProps<any> {}

const PAGE_SIZE = 5;

export class AssetPage extends React.Component<AssetPageProps> {
  private readonly assetStore = this.props.rootStore!.assetStore;
  private readonly transactionStore = this.props.rootStore!.transactionStore;
  private readonly walletStore = this.props.rootStore!.walletStore;

  private pageNumber = 1;

  @observable private transactionsFilterValue: TransactionType[] = [];

  @observable private areTransactionsLoading = false;

  @observable private hasMoreTransactions = true;

  constructor(props: any) {
    super(props);

    reaction(
      () => ({
        page: this.pageNumber,
        transactionsLength: this.transactionStore.assetTransactions.length
      }),
      params => {
        this.hasMoreTransactions =
          params.transactionsLength === params.page * PAGE_SIZE;
      }
    );
  }

  componentDidMount() {
    this.loadTransactions();

    window.scrollTo(0, 0);
  }

  render() {
    const {assetId} = this.props.match.params;
    const asset = this.assetStore.getById(assetId) || new AssetModel();
    const wallet = this.walletStore.tradingWallets[0];
    const balance = wallet && wallet.balances.find(b => b.assetId === assetId);
    const transactionFilters = [
      {
        label: 'Trading',
        value: [TransactionType.Trade, TransactionType.LimitTrade]
      },
      {
        label: 'Deposit & Withdraw',
        value: [TransactionType.CashIn, TransactionType.CashOut]
      },
      {
        label: 'All',
        value: []
      }
    ];

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
          <div className="asset-page">
            <h2 className="asset-page__name">{asset.name}</h2>
            {balance && (
              <span className="asset-page__amount">
                {asBalance(balance)} {balance.asset.name}
              </span>
            )}
            <div className="asset-page__description">{asset.description}</div>
            <div className="asset-page__actions">
              {asset.isBankDepositEnabled && (
                <ul className="action-list">
                  <li className="action-list__title">Deposit</li>
                  <li className="action-list__item">
                    <Link
                      to={ROUTE_DEPOSIT_CREDIT_CARD_TO(wallet.id, asset.id)}
                    >
                      <img
                        className="icon"
                        src={`${process.env
                          .PUBLIC_URL}/images/paymentMethods/deposit-credit-card.svg`}
                      />
                      Deposit with credit card
                    </Link>
                  </li>
                </ul>
              )}
              <ul className="action-list">
                <li className="action-list__title">Trading</li>
                <li className="action-list__item">
                  <a href="http://trade.lykke.com" target="_blank">
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

        <div className="filters-row">
          <div className="container">
            <div className="transaction-filters">
              <div className="transaction-filters__title">
                Latest Transactions
              </div>
              {transactionFilters.map(tf => (
                <div
                  className={classnames('transaction-filters__item', {
                    'transaction-filters__item_active': arraysEqual(
                      this.transactionsFilterValue,
                      tf.value
                    )
                  })}
                  key={tf.label}
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => this.handleTransactionsFilterChange(tf.value)}
                >
                  {tf.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container">
          <div className="transactions-table">
            <InfiniteScroll
              loadMore={this.handleLoadMoreTransactions}
              hasMore={this.hasMoreTransactions}
            >
              {(!this.areTransactionsLoading || this.pageNumber > 1) && (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Wallet</th>
                      <th>Date</th>
                      <th>Operation</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.transactionStore.assetTransactions.length === 0 &&
                      !this.hasMoreTransactions && (
                        <tr className="empty-state">
                          <td>&nbsp;</td>
                          <td />
                          <td>Transactions not found.</td>
                          <td />
                          <td />
                        </tr>
                      )}
                    {this.transactionStore.assetTransactions.map(t => (
                      <tr key={t.id}>
                        <td>
                          <img
                            width="48"
                            src={`${process.env
                              .PUBLIC_URL}/images/asset_lkk.svg`}
                          />
                          Current accounts
                        </td>
                        <td>
                          <FormattedDate
                            day="2-digit"
                            month="2-digit"
                            year="2-digit"
                            value={t.dateTime}
                          />, <FormattedTime value={t.dateTime} />
                        </td>
                        <td>{TransactionTypeLabel[t.type]}</td>
                        <td>{TransactionStatusLabel[t.state]}</td>
                        <td>
                          <ColoredAmount
                            value={t.amount}
                            accuracy={asset.accuracy}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </InfiniteScroll>
            {this.areTransactionsLoading && <Spinner />}
            {this.hasMoreTransactions &&
              !this.areTransactionsLoading && (
                <div
                  className="show-more-button"
                  onClick={this.handleLoadMoreTransactions}
                >
                  Show more...
                </div>
              )}
          </div>
        </div>
      </div>
    );
  }

  private loadTransactions = async () => {
    const {assetId} = this.props.match.params;
    this.areTransactionsLoading = true;
    await this.transactionStore.fetchAssetTransactions(
      assetId,
      0,
      PAGE_SIZE * this.pageNumber,
      this.transactionsFilterValue
    );
    this.areTransactionsLoading = false;
  };

  private handleTransactionsFilterChange = async (
    transactionType: TransactionType[]
  ) => {
    this.transactionsFilterValue = transactionType;
    this.pageNumber = 1;
    this.loadTransactions();
  };

  private handleLoadMoreTransactions = async () => {
    this.pageNumber++;
    this.loadTransactions();
  };
}

export default inject(STORE_ROOT)(observer(AssetPage));
