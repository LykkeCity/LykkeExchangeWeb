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
  Advanced:
    'You can transfer up to $MaxLimit EUR and trade without limits and fees',
  Beginner: 'You can explore the world of crypto',
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
  const currentTier = tierInfo.CurrentTier;
  let description = descriptionMapping[currentTier.Tier];
  description = description.replace('$MaxLimit', currentTier.MaxLimit);

  let tierIcon = '';
  if (currentTier.Tier === 'Beginner') {
    tierIcon = `${process.env.PUBLIC_URL}/images/tier_beginner.png`;
  } else if (currentTier.Tier === 'Advanced') {
    tierIcon = `${process.env.PUBLIC_URL}/images/tier_advanced.png`;
  } else if (currentTier.Tier === 'ProIndividual') {
    tierIcon = `${process.env.PUBLIC_URL}/images/tier_pro.png`;
  }

  return (
    <div className="account-current-tier-widget">
      <div className="account-current-tier-widget__tier-icon">
        <img src={tierIcon} />
      </div>
      <div className="account-current-tier-widget__right-wrapper">
        <div className="verification-page__muted-title">Your Account</div>
        <div className="account-current-tier-widget__tier">
          {tierNamesMapping[currentTier.Tier]}
        </div>
        <div className="account-current-tier-widget__description">
          {description}
        </div>
      </div>
    </div>
  );
};

export default inject(STORE_ROOT)(observer(AccountCurrentTierWidget));
