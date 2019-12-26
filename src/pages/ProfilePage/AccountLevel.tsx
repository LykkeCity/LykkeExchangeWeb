import {inject, observer} from 'mobx-react';
import React from 'react';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';

export const AccountLevel: React.SFC<RootStoreProps> = ({rootStore}) => {
  const tierInfo = rootStore!.kycStore.tierInfo;
  if (!tierInfo) {
    return null;
  }
  const tierNamesMapping = {
    Advanced: 'Advanced',
    Beginner: 'Beginner',
    ProIndividual: 'Pro Individual'
  };

  const isMaxLimitReached = rootStore!.kycStore.isMaxLimitReached;
  const showUpgradeButton = !!tierInfo.NextTier;
  const upgradeButton = (
    <div className="account-level__upgrade">
      <Link to="/profile/kyc" className="btn btn-link">
        Upgrade
      </Link>
    </div>
  );

  const upgradeLimitButton = (
    <div className="account-level__upgrade">
      <Link to="/profile/kyc" className="btn btn-link">
        Upgrade Limit
      </Link>
    </div>
  );

  return (
    <div>
      <h2 className="account-level__title">Account level</h2>
      <div className="account-level">
        <div className="account-level__icon">
          <img src={`${process.env.PUBLIC_URL}/images/verify_approved.png`} />
        </div>
        <div className="account-level-right">
          <div className="account-level-right__tier">
            {tierNamesMapping[tierInfo.CurrentTier.Tier]}
          </div>
          <div className="account-level-right__status">Verified</div>
        </div>
        {showUpgradeButton && upgradeButton}
        {!showUpgradeButton && isMaxLimitReached && upgradeLimitButton}
      </div>
    </div>
  );
};

export default inject(STORE_ROOT)(observer(AccountLevel));
