import {inject, observer} from 'mobx-react';
import React from 'react';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';

export const Completed: React.SFC<RootStoreProps> = ({rootStore}) => {
  const kycStore = rootStore!.kycStore;
  const tierInfo = kycStore.tierInfo;
  if (!tierInfo) {
    return null;
  }
  const showUpgradeToPro = !!tierInfo.NextTier;
  return (
    <div>
      <div className="verification-page__big-title">
        Your account is approved
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
          <Link to="/" className="btn">
            OK
          </Link>
        </div>
      </div>
    </div>
  );
};

export default inject(STORE_ROOT)(observer(Completed));
