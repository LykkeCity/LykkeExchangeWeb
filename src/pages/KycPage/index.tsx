import {ClickOutside} from '@lykkex/react-components';
import classnames from 'classnames';
import {action, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_WALLETS_TRADING} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {AccountInfoDropdown} from './AccountInfoDropdown';
import {VerificationStep} from './VerificationStep';

import './style.css';

interface KycPageProps extends RootStoreProps, RouteComponentProps<any> {}

export class KycPage extends React.Component<KycPageProps> {
  @observable isEmailVerified = false;
  @observable isPhoneVerified = false;
  @observable isVerificationStarted = false;
  @observable isSidebarOpened = false;
  @observable notificationMessage = '';

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className="kyc-page">
        <div className="kyc-page__color" />
        <div className="kyc-page__header">
          <img
            src={`${process.env.PUBLIC_URL}/images/lykke-logo-web.svg`}
            className="kyc-page__logo"
          />
          <div>
            <Link className="skip-link" to={ROUTE_WALLETS_TRADING}>
              Skip verification for later
            </Link>
          </div>
        </div>
        <div className="container">
          <ClickOutside onClickOutside={this.closeSidebar}>
            <div>
              <div
                className="kyc-page__sidebar-toggle"
                onClick={this.handleSidebarToggleClick}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/images/explorer-img.jpg`}
                />
              </div>
              <div
                className={classnames('kyc-page__sidebar col-sm-5', {
                  'kyc-page__sidebar_opened': this.isSidebarOpened
                })}
              >
                <div className="kyc-page__badge kyc-page-badge">
                  <img
                    src={`${process.env.PUBLIC_URL}/images/explorer-img.jpg`}
                  />
                  <div>
                    <div className="kyc-page-badge__title">Your Account</div>
                    <div className="kyc-page-badge__name">Explorer</div>
                    <div className="kyc-page-badge__description">
                      You can just explore the Lykke
                    </div>
                  </div>
                </div>
                <div className="kyc-account-info-wrapper kyc-account-info-wrapper_current">
                  <img
                    src={`${process.env
                      .PUBLIC_URL}/images/apprentice_account.svg`}
                  />
                  <div className="kyc-account-info kyc-account-info_current">
                    <div className="kyc-account-info__label">Upgrade to</div>
                    <div className="kyc-account-info__name">Apprentice</div>
                    <div className="kyc-account-info__description">
                      Upgrade to buy your first Bitcoins, Ether and other
                      crypto.
                    </div>
                    <ul className="kyc-account-info__steps">
                      <li className="active">
                        <span className="step-icon">
                          {this.isEmailVerified && '✓'}
                        </span>Email verification
                      </li>
                      <li
                        className={classnames({
                          active: this.isEmailVerified
                        })}
                      >
                        <span className="step-icon" />Phone verification
                      </li>
                      <li>
                        <span className="step-icon" />ID verification
                      </li>
                      <li>
                        <span className="step-icon" />Selfie
                      </li>
                    </ul>
                  </div>
                </div>
                <AccountInfoDropdown
                  name="Expert"
                  description="Upgrade to transfer up to $5000 daily / $18000 monthly"
                  imageSrc={`${process.env
                    .PUBLIC_URL}/images/expert_account.jpg`}
                  steps={['Verified apprentice', 'Proof of address']}
                />
                <AccountInfoDropdown
                  name="Master"
                  description="Upgrade to transfer up to $20000 daily / $200000 monthly"
                  imageSrc={`${process.env
                    .PUBLIC_URL}/images/master_account.svg`}
                  steps={['Verified expert', 'Proof of funds']}
                />
              </div>
            </div>
          </ClickOutside>
          <div className="kyc-page__step col-sm-7">
            {!this.isEmailVerified && (
              <div>
                {!this.isVerificationStarted && (
                  <div className="verification">
                    <div className="verification__title">Verify your email</div>
                    <div className="verification__description">
                      Click the button below to receive verification code.
                    </div>
                    <input
                      type="submit"
                      onClick={this.handleStartVerificationClick}
                      value="Send verification code"
                      className="btn btn--primary verification__button"
                    />
                  </div>
                )}

                {this.isVerificationStarted && (
                  <VerificationStep
                    title="Verify your email"
                    description="Please enter the code you received in your mailbox"
                    hint="Email sent to: john@smithmartin.com"
                    buttonText="Verify email"
                    onSubmit={this.handleVerifyEmailClick}
                  />
                )}
              </div>
            )}

            {this.isEmailVerified &&
              !this.isPhoneVerified && (
                <div>
                  {!this.isVerificationStarted && (
                    <div className="verification">
                      <div className="verification__title">
                        Verify your phone number
                      </div>
                      <div className="verification__description">
                        Click the button below to receive verification code via
                        SMS
                      </div>
                      <input
                        type="submit"
                        onClick={this.handleStartVerificationClick}
                        value="Send verification code"
                        className="btn btn--primary verification__button"
                      />
                    </div>
                  )}

                  {this.isVerificationStarted && (
                    <VerificationStep
                      title="Verify your phone number"
                      description="Please enter the code you received via SMS"
                      hint="SMS code sent to: +112 345 67 89"
                      buttonText="Verify phone"
                      onSubmit={this.handleVerifyPhoneClick}
                    />
                  )}
                </div>
              )}
          </div>
        </div>
        {this.notificationMessage && (
          <div className="kyc-page__notification">
            <img src={`${process.env.PUBLIC_URL}/images/done.svg`} />
            {this.notificationMessage}
            <img
              className="close-button"
              onClick={this.closeNotification}
              src={`${process.env.PUBLIC_URL}/images/close-icn.svg`}
            />
          </div>
        )}
      </div>
    );
  }

  @action
  private handleStartVerificationClick = () => {
    this.isVerificationStarted = true;
  };

  @action
  private handleVerifyEmailClick = () => {
    this.isEmailVerified = true;
    this.isVerificationStarted = false;
    this.notificationMessage = 'Your email has been successfully verified';
  };

  @action
  private handleVerifyPhoneClick = () => {
    this.isPhoneVerified = true;
  };

  @action
  private closeSidebar = () => {
    this.isSidebarOpened = false;
  };

  @action
  private handleSidebarToggleClick = () => {
    this.isSidebarOpened = true;
  };

  @action
  private closeNotification = () => {
    this.notificationMessage = '';
  };
}

export default inject(STORE_ROOT)(observer(KycPage));
