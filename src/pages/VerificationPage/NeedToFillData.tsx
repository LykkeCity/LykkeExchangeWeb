import {inject, observer} from 'mobx-react';
import React from 'react';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {Wrapper} from '../../components/Verification';
import {AnalyticsEvent} from '../../constants/analyticsEvents';
import {STORE_ROOT} from '../../constants/stores';

export const NeedToFillData: React.SFC<RootStoreProps> = ({rootStore}) => {
  const kycStore = rootStore!.kycStore;
  const analyticsService = rootStore!.analyticsService;
  const tierInfo = kycStore.tierInfo;
  if (!tierInfo) {
    return null;
  }
  const requestUpgradeLimitLoading = kycStore.requestUpgradeLimitLoading;
  const getRejectedDocumentList = kycStore.getRejectedDocumentList;
  return (
    <Wrapper>
      <div className="verification-page__big-title">Almost there!</div>
      <div className="verification-page__content mt-30">
        We just need clarification on the following before taking the next
        steps:
        <div className="mt-30">
          {getRejectedDocumentList.map(document => (
            <div key={document}>{document}</div>
          ))}
        </div>
        <div className="mt-30 mb-30">
          <Link
            className="btn btn--stroke"
            to="/profile"
            onClick={() => {
              analyticsService.track(
                AnalyticsEvent.Kyc.ResubmitFromStatusScreen('later')
              );
            }}
          >
            Maybe later
          </Link>
          <button
            className="btn"
            style={{marginLeft: 20}}
            onClick={() => {
              kycStore.setShowForm(true);
              analyticsService.track(
                AnalyticsEvent.Kyc.ResubmitFromStatusScreen('now')
              );
            }}
            disabled={requestUpgradeLimitLoading}
          >
            Update Now
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

export default inject(STORE_ROOT)(observer(NeedToFillData));
