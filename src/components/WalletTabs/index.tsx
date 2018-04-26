import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {withRouter} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_WALLETS_HFT, ROUTE_WALLETS_TRADING} from '../../constants/routes';
import {APPSTORE_LINK, GOOGLEPLAY_LINK} from '../Apps';
import {Banner} from '../Banner';
import {TabLink, TabPane} from '../Tabs';
import './style.css';

export class WalletTabs extends React.Component<any> {
  render() {
    return (
      <div className="wallet-tabs">
        <div className="tabs">
          <TabLink label="Trading" to={ROUTE_WALLETS_TRADING} />
          <TabLink label="API Wallets" to={ROUTE_WALLETS_HFT} />
        </div>
        <Banner
          className="beta-banner"
          title="Information"
          text="The web trading wallet is currently under active development. It will be improved in the coming weeks, to eventually offer the same functionalities as our mobile Lykke Wallet. In the meantime, please use our mobile application to access all fund management functionalities."
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
                Download for iOS
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
                Download for Android
              </a>
              <a className="hide-button">Don't show again</a>
            </div>
          }
        />
        <TabPane to={ROUTE_WALLETS_TRADING}>
          <div className="tab__pane">
            <div className="row">
              <div className="col-sm-12">
                <p className="hint text-left">
                  Trading wallet is driven by LykkeWallet app. You can confirm a
                  Trading Wallet transaction only by signing it on your mobile
                  device. Trading Wallet is secured with 2-of-2 multisignature
                  protection. One key is controlled by Lykke and another one is
                  located on your mobile device. Please keep your 12 words seed
                  private key backup safely.
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
                  API Wallet offers you a faster trading interface. You can have
                  multiple API wallets. Funds deposited to API wallet are under
                  Lykke custodian. The API is secured with an API Key. Please
                  keep the key safe. To withdraw the funds from your API wallet
                  you need to transfer them to your Trading Wallet first.
                </p>
                <p style={{marginTop: '10px'}} className="hint text-left">
                  Read more about using API here&nbsp;<a
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
                  <i className="icon icon--add" /> New Wallet
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
    onCreateNewWallet: rootStore!.uiStore.toggleWalletDrawer
  }))(observer(WalletTabs))
);
