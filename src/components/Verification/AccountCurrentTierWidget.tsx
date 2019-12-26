import {inject, observer} from 'mobx-react';
import React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';

const tierNamesMapping = {
  Advanced: 'Advanced',
  Beginner: 'Beginner',
  ProIndividual: 'Pro Individual'
};

const descriptionMapping = {
  Advanced: 'You can explore the worlds of crypto',
  Beginner: 'You can explore the worlds of crypto',
  ProIndividual:
    'You can transfer up to $MaxLimit EUR and trade without limits and fees'
};

export const AccountCurrentTierWidget: React.SFC<RootStoreProps> = ({
  rootStore
}) => {
  const kycStore = rootStore!.kycStore;
  const tierInfo = kycStore.tierInfo;
  if (!tierInfo) {
    return null;
  }
  let description = descriptionMapping[tierInfo.CurrentTier.Tier];
  description = description.replace('$MaxLimit', tierInfo.CurrentTier.MaxLimit);
  return (
    <div className="account-current-tier-widget">
      <div className="account-current-tier-widget__tier-icon">
        <div className="dummy-icon" />
      </div>
      <div className="account-current-tier-widget__right-wrapper">
        <div className="verification-page__muted-title">Your Account</div>
        <div className="account-current-tier-widget__tier">
          {tierNamesMapping[tierInfo.CurrentTier.Tier]}
        </div>
        <div className="account-current-tier-widget__description">
          {description}
        </div>
      </div>
    </div>
  );
};

export default inject(STORE_ROOT)(observer(AccountCurrentTierWidget));
