import {inject, observer} from 'mobx-react';
import React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {asBalance} from '../../components/hoc/assetBalance';
import TransactionsTable from '../../components/TransactionsTable';
import WalletTabs from '../../components/WalletTabs/index';
import {
  ROUTE_DEPOSIT_CREDIT_CARD_TO,
  ROUTE_WALLETS_TRADING
} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {AssetModel, BalanceModel, TransactionType} from '../../models';

import './style.css';

interface AssetPageProps extends RootStoreProps, RouteComponentProps<any> {}

export class AssetPage extends React.Component<AssetPageProps> {
  private readonly assetStore = this.props.rootStore!.assetStore;
  private readonly transactionStore = this.props.rootStore!.transactionStore;
  private readonly walletStore = this.props.rootStore!.walletStore;
  private readonly profileStore = this.props.rootStore!.profileStore;

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const {assetId} = this.props.match.params;
    const asset = this.assetStore.getById(assetId) || new AssetModel();
    const wallet = this.walletStore.tradingWallets[0];
    const balance = wallet && wallet.balances.find(b => b.assetId === assetId);

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
            <h2 className="asset-page__name">{asset.name}</h2>
            {balance && (
              <span className="asset-page__amount">
                {asBalance(balance)} {balance.asset.name}
              </span>
            )}
            <div className="asset-page__description">{asset.description}</div>
            <div className="asset-page__actions">
              {this.assetStore.assetsAvailableForDeposit.find(
                a => asset.id === a.id
              ) && (
                <ul className="action-list">
                  <li className="action-list__title">Deposit</li>
                  <li className="action-list__item">
                    {this.profileStore.isKycPassed ? (
                      <Link
                        to={ROUTE_DEPOSIT_CREDIT_CARD_TO(wallet.id, asset.id)}
                      >
                        <img
                          className="icon"
                          src={`${process.env
                            .PUBLIC_URL}/images/paymentMethods/deposit-credit-card.svg`}
                        />
                        Credit card
                      </Link>
                    ) : (
                      <a className="disabled">
                        <img
                          className="icon"
                          src={`${process.env
                            .PUBLIC_URL}/images/paymentMethods/deposit-credit-card.svg`}
                        />
                        Credit card
                      </a>
                    )}
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

        <TransactionsTable
          transactions={this.transactionStore.assetTransactions}
          loadTransactions={this.loadTransactions}
          stickyTitle={this.renderStickyTitle(balance)}
        />
      </div>
    );
  }

  private renderStickyTitle = (balance?: BalanceModel) => (
    <div className="sticky-title">
      <h2 className="sticky-title__name">{balance && balance.asset.name}</h2>
      {balance && (
        <span className="sticky-title__amount">
          {asBalance(balance)} {balance.asset.name}
        </span>
      )}
    </div>
  );

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
