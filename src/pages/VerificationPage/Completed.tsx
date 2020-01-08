import {inject, observer} from 'mobx-react';
import queryString from 'qs';
import React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {Wrapper} from '../../components/Verification';
import {STORE_ROOT} from '../../constants/stores';

export const Completed: React.SFC<
  RootStoreProps & RouteComponentProps<any>
> = ({rootStore, location, history}) => {
  const kycStore = rootStore!.kycStore;
  const tierInfo = kycStore.tierInfo;
  if (!tierInfo) {
    return null;
  }
  const showUpgradeToPro = !!tierInfo.NextTier;

  // The same piece of code exists on InReview.tsx too. Move to a component?
  const qs = queryString.parse(location.search, {ignoreQueryPrefix: true});
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
        Your account is approved!
      </div>
      <div className="verification-page__content mt-30">
        You can now transfer up to {tierInfo.CurrentTier.MaxLimit} EUR and trade
        without fees.
        {showUpgradeToPro && (
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

export default inject(STORE_ROOT)(observer(Completed));
