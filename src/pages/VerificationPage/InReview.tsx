import {inject, observer} from 'mobx-react';
import React from 'react';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import VerificationInReviewWidget from '../../components/VerificationInReviewWidget';
import {STORE_ROOT} from '../../constants/stores';

export const InReview: React.SFC<RootStoreProps> = ({rootStore}) => {
  const kycStore = rootStore!.kycStore;
  const tierInfo = kycStore.tierInfo;
  if (!tierInfo) {
    return null;
  }
  const upgradeRequest = tierInfo.UpgradeRequest;
  if (!upgradeRequest) {
    return null;
  }
  const upgradingTier = upgradeRequest.Tier;
  return (
    <div>
      <div className="verification-page__big-title">
        <VerificationInReviewWidget />
        <div className="mt-30">We have everything we need!</div>
      </div>
      <div className="verification-page__content">
        We will check these documents and let you know withing 48 hours the
        status of your account.
        <br />
        <br />
        {upgradingTier === 'Advanced' && (
          <div>
            If you wish to get a monthly limit tailored for you, no problem!{' '}
            <span
              className="upgrade-text"
              onClick={() => kycStore.showSwitchToPro()}
            >
              Just upgrade to a Pro Individual account.
            </span>
          </div>
        )}
        <div className="mt-30 mb-30">
          <Link to="/" className="btn btn--stroke">
            OK
          </Link>
        </div>
      </div>
    </div>
  );
};

export default inject(STORE_ROOT)(observer(InReview));
