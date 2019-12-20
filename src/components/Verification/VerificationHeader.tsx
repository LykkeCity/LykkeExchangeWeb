import React from 'react';
import {Link} from 'react-router-dom';

export const VerificationHeader: React.SFC = ({}) => (
  <div className="lykke-header">
    <div className="lykke-header__desktop-row">
      <div className="lykke-header__logo">
        <div className="logo">
          <a href="/">&nbsp;</a>
        </div>
        <div className="beta">
          <div>beta</div>
        </div>
      </div>
      <div className="main-menu lykke-header__main-menu">&nbsp;</div>
      <div className="lykke-header__actions">
        <div className="lykke-header__skip-verification">
          <Link to="/profile" className="skip">
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

export default VerificationHeader;
