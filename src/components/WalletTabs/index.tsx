import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {withRouter} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_WALLETS_HFT, ROUTE_WALLETS_TRADING} from '../../constants/routes';
import {Banner} from '../Banner';
import {TabPane} from '../Tabs';
import './style.css';

interface WalletTabsProps {
  activeTabRoute?: string;
  showBetaBanner?: boolean;
  showKycBanner?: boolean;
  showKycPendingBanner?: boolean;
  handleHideBetaBannerClick?: () => void;
  onCreateNewWallet?: () => void;
}

export class WalletTabs extends React.Component<WalletTabsProps> {
  render() {
    return (
      <div className="wallet-tabs">
        <TabPane to={ROUTE_WALLETS_TRADING}>
          <Banner
            show={this.props.showKycBanner}
            className="kyc-banner"
            title="KYC incomplete"
            text="In order to deposit funds using credit card, please complete KYC procedure using the Lykke Wallet mobile application."
            footer={
              <div>
                <a
                  href={`${process.env.REACT_APP_KYC_URL}?returnUrl=${window
                    .location.origin}`}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/images/id-icn.svg`}
                    alt="Go to KYC procedure"
                  />
                  <span>Go to KYC procedure</span>
                </a>
              </div>
            }
          />
          <Banner
            show={this.props.showKycPendingBanner}
            warning
            className="kyc-banner"
            title="Your KYC application is pending"
            text="In order to deposit funds using credit card, please complete KYC procedure using the Lykke Wallet mobile application."
            footer={
              <div>
                <a
                  href={`${process.env.REACT_APP_KYC_URL}?returnUrl=${window
                    .location.origin}`}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/images/info-icn.svg`}
                    alt="Check status"
                  />
                  <span>Check status</span>
                </a>
              </div>
            }
          />
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
    handleHideBetaBannerClick: rootStore!.uiStore.hideBetaBanner,
    onCreateNewWallet: rootStore!.uiStore.toggleWalletDrawer,
    showBetaBanner: rootStore!.uiStore.showBetaBanner,
    showKycBanner:
      !rootStore!.profileStore.isKycPassed &&
      !rootStore!.profileStore.isKycPending,
    showKycPendingBanner: rootStore!.profileStore.isKycPending
  }))(observer(WalletTabs))
);
