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

  const upgradeRequest = tierInfo.UpgradeRequest;
  if (upgradeRequest.Status === 'Rejected') {
    return null;
  }

  const timeLeftForReview = rootStore!.kycStore.calculateTimeLeftForReview;
  const status = upgradeRequest.Status;
  let statusText = '';
  let showTimer = false;
  let icon = '';

  if (status === 'Pending') {
    statusText = 'In Review';
    icon = `${process.env.PUBLIC_URL}/images/verify_submitted.png`;
    showTimer = true;
  } else if (status === 'NeedToFillData') {
    statusText = 'Resubmission needed';
    icon = `${process.env.PUBLIC_URL}/images/verify_ntfd.png`;
  } else {
    return null;
  }

  return (
    <div className="in-review-widget">
      <div className="in-review-widget__icon">
        <img src={icon} />
      </div>
      <div className="in-review-widget-right">
        <div className="in-review-widget-right__tier">
          {tierNamesMapping[tierInfo.UpgradeRequest.Tier]}
        </div>
        <div className="in-review-widget-right__status">{statusText}</div>
      </div>
      <div className="in-review-widget__time-left">
        {showTimer ? `${timeLeftForReview}h left` : ''}
      </div>
    </div>
  );
};

export default inject(STORE_ROOT)(observer(VerificationInReviewWidget));
