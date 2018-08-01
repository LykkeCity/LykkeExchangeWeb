import {Button} from '@lykkex/react-components';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import Section from '../Section';
import UserDetails from '../UserDetails';
import VerificationStatus from '../VerificationStatus';

import './style.css';

export const ProfileSection: React.SFC<RootStoreProps> = ({rootStore}) => {
  const {profileStore} = rootStore!;

  const goToKYC = () => {
    window.open('https://kyc.lykke.com', '_blank');
  };

  return (
    <Section title="Profile">
      <div className="row">
        <div className="col-sm-9">
          <UserDetails />
        </div>
        <div className="col-sm-3">
          <VerificationStatus />
        </div>
      </div>
      {!profileStore.isKycPassed ? (
        <div className="row">
          <div className="col-sm-12">
            <Button onClick={goToKYC} className="action-button">
              Go to KYC
            </Button>
          </div>
        </div>
      ) : null}
    </Section>
  );
};
ProfileSection.displayName = 'ProfileSection';

export default inject(STORE_ROOT)(observer(ProfileSection));
