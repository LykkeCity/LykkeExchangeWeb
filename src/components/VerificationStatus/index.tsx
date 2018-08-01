import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';

import './style.css';

export const VerificationStatus: React.SFC<RootStoreProps> = ({rootStore}) => {
  const {profileStore} = rootStore!;

  const renderVerifiedIcon = () => (
    <img
      className="icon"
      src={`${process.env.PUBLIC_URL}/images/done-icn.svg`}
    />
  );
  const renderNotVerifiedIcon = () => (
    <img
      className="icon"
      src={`${process.env.PUBLIC_URL}/images/wait-icn.svg`}
    />
  );

  return (
    <div className="kyc-status">
      <div className="kyc-status__icon">
        {profileStore.isKycPassed
          ? renderVerifiedIcon()
          : renderNotVerifiedIcon()}
      </div>
      <div className="kyc-status__text">
        You are {profileStore.isKycPassed ? 'verified' : 'not verified'}
      </div>
    </div>
  );
};
VerificationStatus.displayName = 'VerificationStatus';

export default inject(STORE_ROOT)(observer(VerificationStatus));
