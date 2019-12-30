import {inject, observer} from 'mobx-react';
import React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import './style.css';

const ONE_HR = 60 * 60 * 1000;

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

  const submitDate = new Date(upgradeRequest.SubmitDate);
  submitDate.setTime(submitDate.getTime() + 48 * ONE_HR);
  let hoursRemained = (submitDate.getTime() - new Date().getTime()) / ONE_HR;
  hoursRemained = Math.floor(hoursRemained);
  hoursRemained = Math.max(hoursRemained, 0);

  const status = upgradeRequest.Status;
  let statusText = '';

  if (status === 'Pending') {
    statusText = 'In Review';
  } else if (status === 'NeedToFillData') {
    statusText = 'Resubmission needed';
  }

  return (
    <div className="in-review-widget">
      <div className="in-review-widget__icon">
        <img src={`${process.env.PUBLIC_URL}/images/verify_submitted.png`} />
      </div>
      <div className="in-review-widget-right">
        <div className="in-review-widget-right__tier">
          {tierNamesMapping[tierInfo.UpgradeRequest.Tier]}
        </div>
        <div className="in-review-widget-right__status">{statusText}</div>
      </div>
      <div className="in-review-widget__time-left">{hoursRemained}h left</div>
    </div>
  );
};

export default inject(STORE_ROOT)(observer(VerificationInReviewWidget));
