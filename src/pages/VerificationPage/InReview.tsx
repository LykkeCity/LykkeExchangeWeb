import {inject, observer} from 'mobx-react';
import queryString from 'query-string';
import React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {Wrapper} from '../../components/Verification';
import VerificationInReviewWidget from '../../components/VerificationInReviewWidget';
import {STORE_ROOT} from '../../constants/stores';

export const InReview: React.SFC<RootStoreProps & RouteComponentProps<any>> = ({
  rootStore,
  location,
  history
}) => {
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

  // The same piece of code exists on Completed.tsx too. Move to a component?
  const qs = queryString.parse(location.search);
  const returnUrl = qs.returnUrl as string;
  const onOkClick = () => {
    if (returnUrl) {
      document.location.href = returnUrl;
    } else {
      history.push('/profile');
    }
  };

  return (
    <Wrapper>
      <div className="verification-page__big-title">
        <VerificationInReviewWidget />
        <div>We have everything we need!</div>
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
          <span className="btn btn--stroke" onClick={onOkClick}>
            OK
          </span>
        </div>
      </div>
    </Wrapper>
  );
};

export default inject(STORE_ROOT)(observer(InReview));
