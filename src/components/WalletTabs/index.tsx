import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {withRouter} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_WALLETS_HFT, ROUTE_WALLETS_TRADING} from '../../constants/routes';
import {Banner} from '../Banner';
import {TabPane} from '../Tabs';
import HftContent from './HftContent';
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
          <HftContent />
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
