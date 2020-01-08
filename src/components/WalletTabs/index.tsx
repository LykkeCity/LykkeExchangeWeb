import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {AnalyticsEvent} from '../../constants/analyticsEvents';
import {ROUTE_WALLETS_HFT, ROUTE_WALLETS_TRADING} from '../../constants/routes';
import {TierInfo} from '../../models';
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
  handleHideBetaBannerClick?: () => void;
  onCreateNewWallet?: () => void;
  isUpgradeRequestRejected?: boolean;
  isUpgradeRequestNeedToFillData?: boolean;
  isUpgradeRequestPending?: boolean;
  tierInfo?: TierInfo;
}

const KYC_URL = process.env.REACT_APP_KYC_URL as string;

export class WalletTabs extends React.Component<WalletTabsProps> {
  render() {
    const {
      isUpgradeRequestNeedToFillData,
      isUpgradeRequestPending,
      isUpgradeRequestRejected,
      tierInfo
    } = this.props;
    let showUpgradeBanner = false;
    let upgradeBannerText = '';
    if (
      !isUpgradeRequestNeedToFillData &&
      !isUpgradeRequestPending &&
      !isUpgradeRequestRejected &&
      tierInfo
    ) {
      const currentTier = tierInfo.CurrentTier;
      const nextTier = tierInfo.NextTier;

      if (
        currentTier.Tier === 'Beginner' &&
        !tierInfo.UpgradeRequest &&
        nextTier
      ) {
        showUpgradeBanner = true;
        upgradeBannerText = `Upgrade your account level to deposit up to ${nextTier.MaxLimit} EUR monthly and trade without limits and fees`;
      } else if (
        currentTier.Tier === 'Advanced' &&
        currentTier.Current >= currentTier.MaxLimit
      ) {
        showUpgradeBanner = true;
        upgradeBannerText = `Upgrade to get a monthly limit tailored for you`;
      }
    }

    return (
      <div className="wallet-tabs">
        <TabPane to={ROUTE_WALLETS_TRADING}>
          <TfaDisabledBanner show={this.props.show2faDisabledBanner} />
          <Banner
            show={showUpgradeBanner}
            className="kyc-banner"
            title="Almost there!"
            text={upgradeBannerText}
            footer={
              <div>
                <Link to={KYC_URL} onClick={this.trackStartKyc}>
                  <img
                    src={`${process.env.PUBLIC_URL}/images/id-icn.svg`}
                    alt="Upgrade Now"
                  />
                  <span>Upgrade Now</span>
                </Link>
              </div>
            }
          />
          <Banner
            show={isUpgradeRequestPending}
            warning
            className="kyc-banner yellow"
            title="KYC under review"
            text="We are in the process of checking your documents and will be in touch shortly"
            footer={
              <div>
                <Link to={KYC_URL} onClick={this.trackCheckKycStatus}>
                  <img
                    src={`${process.env
                      .PUBLIC_URL}/images/verify_submitted.png`}
                    alt="Check status"
                  />
                  <span>Check status</span>
                </Link>
              </div>
            }
          />
          <Banner
            show={isUpgradeRequestNeedToFillData}
            warning
            className="kyc-banner yellow"
            title="Almost there!"
            text="We just need clarification before taking the next steps"
            footer={
              <div>
                <Link to={KYC_URL} onClick={this.trackCheckKycStatus}>
                  <img
                    src={`${process.env.PUBLIC_URL}/images/verify_ntfd.png`}
                    alt="Go to KYC procedure"
                  />
                  <span>Go to KYC procedure</span>
                </Link>
              </div>
            }
          />
          <Banner
            show={isUpgradeRequestRejected}
            error
            className="kyc-banner red"
            title="Account not approved"
            text="We are terribly sorry, but we cannot approve your account based on the data that you provided"
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
    isUpgradeRequestNeedToFillData: rootStore!.kycStore
      .isUpgradeRequestNeedToFillData,
    isUpgradeRequestPending: rootStore!.kycStore.isUpgradeRequestPending,
    isUpgradeRequestRejected: rootStore!.kycStore.isUpgradeRequestRejected,
    onCreateNewWallet: rootStore!.uiStore.toggleWalletDrawer,
    show2faDisabledBanner: rootStore!.profileStore.is2faForbidden,
    showBetaBanner: rootStore!.uiStore.showBetaBanner,
    tierInfo: rootStore!.kycStore.tierInfo
  }))(observer(WalletTabs))
);
