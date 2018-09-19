import {Table} from '@lykkex/react-components';
import classnames from 'classnames';
import {computed, observable, reaction} from 'mobx';
import {inject, observer} from 'mobx-react';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import {FormattedDate, FormattedTime} from 'react-intl';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ColoredAmount} from '../../components/ColoredAmount';
import Spinner from '../../components/Spinner';
import {ROUTE_ASSET, ROUTE_WALLETS_TRADING} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {
  TransactionModel,
  TransactionStatusLabel,
  TransactionType,
  TransactionTypeLabel
} from '../../models';
import {arraysEqual} from '../../utils';
import {Feature, FeatureFlag} from '../../utils/launchDarkly';

import './style.css';

const PAGE_SIZE = 25;
const ASSET_DEFAULT_ICON_URL = `${process.env
  .PUBLIC_URL}/images/assets/asset_default.jpg`;

interface TransactionsTableProps extends RootStoreProps {
  hasAssetLinks?: boolean;
  transactions: TransactionModel[];
  loadTransactions: (
    count: number,
    transactionTypes?: TransactionType[]
  ) => void;
  exportTransactions: (transactionType?: TransactionType[]) => void;
  onTransactionTypeChange?: (transactionType?: TransactionType[]) => void;
  isExportLoading?: boolean;
  stickyTitle?: React.ReactChild;
  showExportButton?: boolean;
}

export class TransactionsTable extends React.Component<TransactionsTableProps> {
  @observable private pageNumber = 1;
  @observable
  private transactionsFilterValue: TransactionType[] = [
    TransactionType.CashIn,
    TransactionType.CashOut,
    TransactionType.Trade
  ];
  @observable private areTransactionsLoading = false;
  @observable private hasMoreTransactions = true;
  @observable private showStickyHeader = false;

  private filtersRowElement: HTMLDivElement;

  @computed
  get showEmptyState() {
    return (
      !this.props.transactions.length &&
      !this.areTransactionsLoading &&
      !this.hasMoreTransactions
    );
  }

  @computed
  get showTransactionsTable() {
    return (
      (!this.areTransactionsLoading || this.pageNumber > 1) &&
      this.props.transactions.length > 0
    );
  }

  @computed
  get showLoadMoreButton() {
    return this.hasMoreTransactions && !this.areTransactionsLoading;
  }

  constructor(props: any) {
    super(props);

    reaction(
      () => ({
        page: this.pageNumber,
        transactionsLength: this.props.transactions.length
      }),
      params => {
        this.hasMoreTransactions =
          params.transactionsLength >= params.page * PAGE_SIZE;
      }
    );
  }

  componentDidMount() {
    this.loadTransactions();

    window.scrollTo(0, 0);
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    return (
      <div className="transactions">
        <div
          className={classnames('sticky-row', {
            'sticky-row_active': this.showStickyHeader
          })}
        >
          <div className="filters-row">
            <div className="container">
              <Link to={ROUTE_WALLETS_TRADING} className="arrow-back">
                <img
                  src={`${process.env.PUBLIC_URL}/images/back-icn.svg`}
                  alt="Back"
                />
              </Link>
              <div className="transaction-filters">
                <div
                  className="transaction-filters__title"
                  onClick={this.handleStickyTitleClick}
                >
                  {this.props.stickyTitle}
                </div>
                <div>{this.renderFiltersRow(true)}</div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="transactions-table">
              <Table responsive>
                <thead>
                  <tr>
                    <th className="transactions-table__asset-col">Asset</th>
                    <th className="transactions-table__date-col">Date</th>
                    <th className="transactions-table__operation-col">
                      Operation
                    </th>
                    <th className="transactions-table__amount-col">Amount</th>
                  </tr>
                </thead>
              </Table>
            </div>
          </div>
        </div>

        <div className="filters-row" ref={this.setFiltersRowElement}>
          <div className="container">
            <div className="transaction-filters">
              <div className="transaction-filters__title">
                Latest transactions
              </div>
              <div>{this.renderFiltersRow()}</div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="transactions-table">
            {this.showEmptyState && (
              <div className="empty-state">
                You don't have any transactions yet
              </div>
            )}
            <div className={classnames({hidden: !this.showTransactionsTable})}>
              <InfiniteScroll
                loadMore={this.handleLoadMoreTransactions}
                hasMore={this.hasMoreTransactions}
              >
                <Table responsive>
                  <thead>
                    <tr>
                      <th className="transactions-table__asset-col">Asset</th>
                      <th className="transactions-table__date-col">Date</th>
                      <th className="transactions-table__operation-col">
                        Operation
                      </th>
                      <th className="transactions-table__amount-col">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.transactions.map(
                      transaction =>
                        transaction.asset && (
                          <tr key={transaction.id + transaction.amount}>
                            <td>
                              <div className="asset-col">
                                <img
                                  width="48"
                                  src={
                                    transaction.asset.iconUrl ||
                                    ASSET_DEFAULT_ICON_URL
                                  }
                                />
                                <div>
                                  <div className="asset-col__asset_name">
                                    {this.props.hasAssetLinks ? (
                                      <Link
                                        to={ROUTE_ASSET(transaction.asset.id)}
                                      >
                                        {transaction.asset.name}
                                      </Link>
                                    ) : (
                                      transaction.asset.name
                                    )}
                                  </div>
                                  <div className="asset-col__wallet_name">
                                    Trading Wallet
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <FormattedDate
                                day="2-digit"
                                month="2-digit"
                                year="2-digit"
                                value={transaction.dateTime}
                              />, <FormattedTime value={transaction.dateTime} />
                            </td>
                            <td>
                              {TransactionTypeLabel[transaction.type]}{' '}
                              {TransactionStatusLabel[transaction.state]}
                            </td>
                            <td>
                              <ColoredAmount
                                value={transaction.amount}
                                accuracy={transaction.asset.accuracy}
                                assetName={transaction.asset.name}
                              />
                            </td>
                          </tr>
                        )
                    )}
                  </tbody>
                </Table>
              </InfiniteScroll>
            </div>
            {this.areTransactionsLoading && <Spinner />}
            {this.showLoadMoreButton && (
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

  private renderFiltersRow = (isSticky?: boolean) => {
    const transactionFilters = [
      {
        label: 'All',
        value: [
          TransactionType.CashIn,
          TransactionType.CashOut,
          TransactionType.Trade
        ]
      },
      {
        label: 'Deposit & Withdraw',
        value: [TransactionType.CashIn, TransactionType.CashOut]
      },
      {
        label: 'Trading',
        value: [TransactionType.Trade]
      }
    ];

    return (
      <div>
        {transactionFilters.map(filter => this.renderFilter(filter, isSticky))}
        {(this.props.showExportButton || isSticky) && (
          <FeatureFlag
            flagKey={Feature.ExportTradingHistory}
            // tslint:disable-next-line:jsx-no-lambda
            renderFeatureCallback={() => (
              <span
                className={classnames('btn-shadow btn-export', {
                  'has-spinner': this.props.isExportLoading
                })}
                onClick={this.handleExportClick}
              >
                {this.props.isExportLoading ? (
                  <Spinner />
                ) : (
                  <span>
                    <img
                      src={`${process.env.PUBLIC_URL}/images/export-icn.svg`}
                    />
                    CSV
                  </span>
                )}
              </span>
            )}
          />
        )}
      </div>
    );
  };

  private renderFilter = (filter: any, isSticky?: boolean) => (
    <span
      className={classnames('transaction-filters__item', {
        'transaction-filters__item_active': arraysEqual(
          this.transactionsFilterValue,
          filter.value
        )
      })}
      key={filter.label}
      // tslint:disable-next-line:jsx-no-lambda
      onClick={() =>
        this.handleTransactionsFilterChange(filter.value, isSticky)}
    >
      {filter.label}
    </span>
  );

  private handleExportClick = async () => {
    this.props.exportTransactions(this.transactionsFilterValue);
  };

  private loadTransactions = async () => {
    this.areTransactionsLoading = true;
    await this.props.loadTransactions(
      this.pageNumber * PAGE_SIZE,
      this.transactionsFilterValue
    );
    this.areTransactionsLoading = false;
  };

  private handleTransactionsFilterChange = async (
    transactionType: TransactionType[],
    shouldScroll?: boolean
  ) => {
    if (shouldScroll && this.filtersRowElement) {
      const FILTER_ROW_TOP_OFFSET = 170;
      const filtersRowStartPosition =
        this.filtersRowElement.offsetTop - FILTER_ROW_TOP_OFFSET;
      window.scrollTo(0, filtersRowStartPosition);
    }

    if (this.props.onTransactionTypeChange) {
      this.props.onTransactionTypeChange(transactionType);
    }
    this.transactionsFilterValue = transactionType;
    this.pageNumber = 1;
    this.loadTransactions();
  };

  private handleLoadMoreTransactions = async () => {
    if (this.areTransactionsLoading) {
      return;
    }

    this.pageNumber++;
    this.loadTransactions();
  };

  private handleScroll = () => {
    if (this.filtersRowElement) {
      const STICKY_HEADER_TOP_OFFSET = 30;
      const stickyHeaderBreakpointPosition =
        this.filtersRowElement.offsetTop - STICKY_HEADER_TOP_OFFSET;

      this.showStickyHeader =
        window.pageYOffset >= stickyHeaderBreakpointPosition &&
        this.props.transactions.length > 0;
    }
  };

  private handleStickyTitleClick = () => {
    window.scrollTo(0, 0);
  };

  private setFiltersRowElement = (element: HTMLDivElement) => {
    this.filtersRowElement = element;
  };
}

export default inject(STORE_ROOT)(observer(TransactionsTable));
