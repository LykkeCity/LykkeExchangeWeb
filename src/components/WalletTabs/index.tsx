import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {withRouter} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_WALLETS_HFT, ROUTE_WALLETS_TRADING} from '../../constants/routes';
import {APPSTORE_LINK, GOOGLEPLAY_LINK} from '../Apps';
import {Banner} from '../Banner';
import {TabLink, TabPane} from '../Tabs';
import './style.css';

interface WalletTabsProps {
  activeTabRoute?: string;
  showBetaBanner?: boolean;
  showKycBanner?: boolean;
  handleHideBetaBannerClick?: () => void;
  onCreateNewWallet?: () => void;
  labels?: any;
}

export class WalletTabs extends React.Component<WalletTabsProps> {
  render() {
    return (
      <div className="wallet-tabs">
        <div className="tabs">
          <TabLink
            label={this.props.labels.Trading}
            to={ROUTE_WALLETS_TRADING}
            active={this.props.activeTabRoute === ROUTE_WALLETS_TRADING}
          />
          <TabLink
            label={this.props.labels.APIWallets}
            to={ROUTE_WALLETS_HFT}
            active={this.props.activeTabRoute === ROUTE_WALLETS_HFT}
          />
        </div>
        <Banner
          show={this.props.showBetaBanner}
          className="beta-banner"
          title={this.props.labels.BetaBannerTitle}
          text={this.props.labels.BetaBannerContent}
          footer={
            <div>
              <a
                href={APPSTORE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="app-link"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/images/apple-icn.svg`}
                  alt="App Store"
                />
                {this.props.labels.IOSDownload}
              </a>
              <a
                href={GOOGLEPLAY_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="app-link"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/images/google-play-icn.svg`}
                  alt="Google Play"
                />
                {this.props.labels.AndroidDownload}
              </a>
              <a
                className="hide-button"
                onClick={this.props.handleHideBetaBannerClick}
              >
                {this.props.labels.NotAgain}
              </a>
            </div>
          }
        />
        <TabPane to={ROUTE_WALLETS_TRADING}>
          <Banner
            show={this.props.showKycBanner}
            warning
            className="kyc-banner"
            title={this.props.labels.KycBannerTitle}
            text={this.props.labels.KycBannerContent}
            footer={
              <div>
                <a
                  href={APPSTORE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="app-link"
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/images/apple-icn.svg`}
                    alt="App Store"
                  />
                  {this.props.labels.IOSDownload}
                </a>
                <a
                  href={GOOGLEPLAY_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="app-link"
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/images/google-play-icn.svg`}
                    alt="Google Play"
                  />
                  {this.props.labels.AndroidDownload}
                </a>
              </div>
            }
          />
          <div className="tab__pane">
            <div className="row">
              <div className="col-sm-12">
                <p className="hint text-left">
                  {this.props.labels.TradingWalletInfo}
                </p>
              </div>
            </div>
          </div>
        </TabPane>
        <TabPane to={ROUTE_WALLETS_HFT}>
          <div className="tab__pane">
            <div className="row">
              <div className="col-sm-8">
                <p className="hint text-left">
                  {this.props.labels.APIWalletInfo}
                </p>
                <p style={{marginTop: '10px'}} className="hint text-left">
                  {this.props.labels.APIWalletMoreInfo}&nbsp;<a
                    className="link"
                    href="https://www.lykke.com/lykke_api"
                    target="_blank"
                  >
                    {'https://www.lykke.com/lykke_api'}
                  </a>
                </p>
              </div>
              <div className="col-sm-4 text-right">
                <button
                  className="btn btn--primary btn-sm"
                  onClick={this.props.onCreateNewWallet}
                >
                  <i className="icon icon--add" /> {this.props.labels.NewWallet}
                </button>
              </div>
            </div>
          </div>
        </TabPane>
      </div>
    );
  }
}

export default withRouter(
  inject(({rootStore}: RootStoreProps) => ({
    handleHideBetaBannerClick: rootStore!.uiStore.hideBetaBanner,
    labels: rootStore!.localizationStore.i18nWalletTabs,
    onCreateNewWallet: rootStore!.uiStore.toggleWalletDrawer,
    showBetaBanner: rootStore!.uiStore.showBetaBanner,
    showKycBanner: !rootStore!.profileStore.isKycPassed
  }))(observer(WalletTabs))
);
