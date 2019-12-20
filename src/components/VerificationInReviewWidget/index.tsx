import {inject, observer} from 'mobx-react';
import React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import './style.css';

export const VerificationInReviewWidget: React.SFC<RootStoreProps> = ({
  rootStore
}) => {
  const tierInfo = rootStore!.kycStore.tierInfo;
  if (!tierInfo || !tierInfo.UpgradeRequest) {
    return null;
  }
  const tierNamesMapping = {
    Advanced: 'Advanced',
    ProIndividual: 'Pro Individual'
  };

  return (
    <div className="in-review-widget">
      <div className="in-review-widget__icon">
        <img src={`${process.env.PUBLIC_URL}/images/verify_submitted.png`} />
      </div>
      <div className="in-review-widget-right">
        <div className="in-review-widget-right__tier">
          {tierNamesMapping[tierInfo.UpgradeRequest.Tier]}
        </div>
        <div className="in-review-widget-right__status">In Review</div>
      </div>
      <div className="in-review-widget__time-left">48h left</div>
    </div>
  );
};

export default inject(STORE_ROOT)(observer(VerificationInReviewWidget));
