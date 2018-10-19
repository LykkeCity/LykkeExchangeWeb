import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {withRouter} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {AnalyticsEvent} from '../../constants/analyticsEvents';
import {ROUTE_WALLETS_HFT, ROUTE_WALLETS_TRADING} from '../../constants/routes';
import {Banner} from '../Banner';
import {TfaDisabledBanner} from '../Banner/TfaDisabledBanner';
import {TabPane} from '../Tabs';
import HftContent from './HftContent';
import './style.css';

interface WalletTabsProps {
  analyticsService?: any;
  activeTabRoute?: string;
  show2faDisabledBanner?: boolean;
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
          <TfaDisabledBanner show={this.props.show2faDisabledBanner} />
          <Banner
            show={this.props.showKycBanner}
            className="kyc-banner"
            title="Almost there!"
            text="To start trading now simply complete KYC"
            footer={
              <div>
                <a
                  href={`${process.env.REACT_APP_KYC_URL}?returnUrl=${window
                    .location.origin}`}
                  onClick={this.trackStartKyc}
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
            title="KYC under review"
            text="We are in the process of checking your documentation and will be in touch shortly"
            footer={
              <div>
                <a
                  href={`${process.env.REACT_APP_KYC_URL}?returnUrl=${window
                    .location.origin}`}
                  onClick={this.trackCheckKycStatus}
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

  private trackStartKyc = () => {
    this.props.analyticsService.track(AnalyticsEvent.StartKyc);
  };

  private trackCheckKycStatus = () => {
    this.props.analyticsService.track(AnalyticsEvent.CheckKycStatus);
  };
}

export default withRouter(
  inject(({rootStore}: RootStoreProps) => ({
    analyticsService: rootStore!.analyticsService,
    handleHideBetaBannerClick: rootStore!.uiStore.hideBetaBanner,
    onCreateNewWallet: rootStore!.uiStore.toggleWalletDrawer,
    show2faDisabledBanner: rootStore!.profileStore.is2faForbidden,
    showBetaBanner: rootStore!.uiStore.showBetaBanner,
    showKycBanner:
      !rootStore!.profileStore.isKycPassed &&
      !rootStore!.profileStore.isKycPending,
    showKycPendingBanner: rootStore!.profileStore.isKycPending
  }))(observer(WalletTabs))
);
