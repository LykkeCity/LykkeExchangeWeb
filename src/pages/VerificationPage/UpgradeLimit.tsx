import {inject, observer} from 'mobx-react';
import React from 'react';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {Wrapper} from '../../components/Verification';
import {STORE_ROOT} from '../../constants/stores';

export const UpgradeLimit: React.SFC<RootStoreProps> = ({rootStore}) => {
  const kycStore = rootStore!.kycStore;
  const tierInfo = kycStore.tierInfo;
  if (!tierInfo) {
    return null;
  }
  const maxLimit = tierInfo.CurrentTier.MaxLimit;
  const requestUpgradeLimitLoading = kycStore.requestUpgradeLimitLoading;
  const email = 'support@lykke.com';
  const subject = 'Upgrade Pro Individual deposit limit';
  const body =
    "I'd like to increase the Individual deposit limit. Please send me detailed information how to proceed.";
  return (
    <Wrapper>
      <div className="verification-page__big-title">
        <div className="mt-30">Upgrade monthly deposit limit</div>
      </div>
      <div className="verification-page__content mt-30">
        You have reached your monthly deposit limit of {maxLimit} EUR. In order
        to increase the limit get in touch with{' '}
        <a href={`mailto:${email}?subject=${subject}&body=${body}`}>{email}</a>
        <div className="mt-30 mb-30">
          <Link className="btn btn--stroke" to="/profile">
            Maybe later
          </Link>
          <button
            className="btn"
            style={{marginLeft: 20}}
            onClick={() => {
              kycStore.requestUpgradeLimit();
            }}
            disabled={requestUpgradeLimitLoading}
          >
            Send Request
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

export default inject(STORE_ROOT)(observer(UpgradeLimit));
