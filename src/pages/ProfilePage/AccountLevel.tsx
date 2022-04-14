import {inject, observer} from 'mobx-react';
import React from 'react';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {AnalyticsEvent, Place} from '../../constants/analyticsEvents';
import {STORE_ROOT} from '../../constants/stores';

export const AccountLevel: React.SFC<RootStoreProps> = ({rootStore}) => {
  const kycStore = rootStore!.kycStore;
  const analyticsService = rootStore!.analyticsService;
  const tierInfo = kycStore.tierInfo;
  if (!tierInfo) {
    return null;
  }
  const tierNamesMapping = {
    Advanced: 'Advanced',
    Beginner: 'Beginner',
    ProIndividual: 'Pro Individual'
  };

  const isMaxLimitReached = kycStore.isMaxLimitReached;
  let showUpgradeButton = false;
  if (tierInfo.NextTier) {
    showUpgradeButton = true;
  }
  if (kycStore.isUpgradeRequestRejected) {
    showUpgradeButton = false;
  }

  const isBeginner = tierInfo.CurrentTier.Tier === 'Beginner';

  const upgradeButton = (
    <div className="account-level__upgrade">
      <Link
        to="/profile/kyc"
        className="btn btn--stroke"
        onClick={() => {
          const upgradeRequest = tierInfo.UpgradeRequest;
          if (
            (upgradeRequest && upgradeRequest.Status === 'Pending') ||
            tierInfo.CurrentTier.Tier === 'Advanced'
          ) {
            kycStore.showSwitchToPro();
          }
          analyticsService.track(
            AnalyticsEvent.StartTierUpgrade(Place.ProfilePage)
          );
        }}
      >
        {isBeginner ? 'Verify' : 'Upgrade'}
      </Link>
    </div>
  );

  const upgradeLimitButton = (
    <div className="account-level__upgrade">
      <Link
        to="/profile/kyc"
        className="btn btn--stroke"
        onClick={() => {
          analyticsService.track(AnalyticsEvent.StartLimitUpgrade);
        }}
      >
        Upgrade Limit
      </Link>
    </div>
  );

  return (
    <div>
      <h2 className="account-level__title">Account Level</h2>
      <div className="account-level">
        <div className="account-level__icon">
          <img
            src={`${process.env.PUBLIC_URL}/images/${isBeginner
              ? 'verify_ntfd.png'
              : 'verify_approved.png'}`}
          />
        </div>
        <div className="account-level-right">
          <div className="account-level-right__tier">
            {!isBeginner
              ? tierNamesMapping[tierInfo.CurrentTier.Tier]
              : 'Unverified'}
          </div>
          {!isBeginner ? (
            <div className="account-level-right__status">Verified</div>
          ) : (
            ''
          )}
        </div>
        {showUpgradeButton && upgradeButton}
        {!showUpgradeButton && isMaxLimitReached && upgradeLimitButton}
      </div>
    </div>
  );
};

export default inject(STORE_ROOT)(observer(AccountLevel));
