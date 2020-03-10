import {inject, observer} from 'mobx-react';
import React from 'react';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {AnalyticsEvent} from '../../constants/analyticsEvents';
import {STORE_ROOT} from '../../constants/stores';

export const VerificationHeader: React.SFC<RootStoreProps> = ({rootStore}) => (
  <div className="lykke-header">
    <div className="lykke-header__desktop-row">
      <div className="lykke-header__logo">
        <div className="logo">
          <a href="/">&nbsp;</a>
        </div>
      </div>
      <div className="main-menu lykke-header__main-menu">&nbsp;</div>
      <div className="lykke-header__actions">
        <div className="lykke-header__skip-verification">
          <Link
            to="/profile"
            className="skip"
            onClick={() => {
              const currentForm = rootStore!.kycStore.decideCurrentFormToRender;
              rootStore!.analyticsService.track(
                AnalyticsEvent.Kyc.SkipVerificationForLater(currentForm)
              );
            }}
          >
            Skip Verification For Later
          </Link>
        </div>
      </div>
    </div>
    <div className="lykke-header__mobile-row">
      <span className="title">verification</span>
      <div>
        <Link to="/" className="skip">
          Skip
        </Link>
      </div>
    </div>
  </div>
);

export default inject(STORE_ROOT)(observer(VerificationHeader));
