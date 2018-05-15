import {inject, observer} from 'mobx-react';
import React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {asBalance} from '../../components/hoc/assetBalance';
import WalletTabs from '../../components/WalletTabs/index';
import {
  ROUTE_DEPOSIT_CREDIT_CARD_TO,
  ROUTE_WALLETS_TRADING
} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {AssetModel} from '../../models/index';

import './style.css';

interface AssetPageProps extends RootStoreProps, RouteComponentProps<any> {}

export class AssetPage extends React.Component<AssetPageProps> {
  private readonly assetStore = this.props.rootStore!.assetStore;
  private readonly walletStore = this.props.rootStore!.walletStore;

  componentDidMount() {
    const {assetId} = this.props.match.params;
    this.assetStore.selectedAsset =
      this.assetStore.getById(assetId) || new AssetModel();

    window.scrollTo(0, 0);
  }

  render() {
    const asset = this.assetStore.selectedAsset;
    const wallet = this.walletStore.tradingWallets[0];
    const balance = wallet && wallet.balances.find(b => b.assetId === asset.id);

    return (
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
                  <Link to={ROUTE_DEPOSIT_CREDIT_CARD_TO(wallet.id, asset.id)}>
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
    );
  }
}

export default inject(STORE_ROOT)(observer(AssetPage));
