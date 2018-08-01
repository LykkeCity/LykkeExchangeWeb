import classnames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';

import './style.css';

export const UserDetails: React.SFC<RootStoreProps> = ({rootStore}) => {
  const {profileStore} = rootStore!;

  return (
    <div>
      <div className="profile-image">
        <img
          src={`${process.env.PUBLIC_URL}/images/user_default.svg`}
          width="90"
          alt="user_image"
        />
      </div>
      <div className="profile-details">
        <div className="profile-details__name">{profileStore.fullName}</div>
        <div className="profile-details__email">{profileStore.email}</div>
        <div
          className={classnames('profile-details__status', {
            verified: profileStore.isKycPassed
          })}
        >
          {profileStore.isKycPassed ? 'Verified' : 'Not verified'}
        </div>
      </div>
    </div>
  );
};
UserDetails.displayName = 'UserDetails';

export default inject(STORE_ROOT)(observer(UserDetails));
