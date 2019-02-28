import {MenuItem} from '@lykkex/react-components';
import classnames from 'classnames';
import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {RootStoreProps} from '../../App';
import {TfaDisabledBanner} from '../../components/Banner/TfaDisabledBanner';
import {AnalyticsEvent} from '../../constants/analyticsEvents';
import {STORE_ROOT} from '../../constants/stores';

import './style.css';

// tslint:disable-next-line:no-var-requires
const QRCode = require('qrcode.react');

// tslint:disable-next-line:no-var-requires
const TextMask = require('react-text-mask').default;

const SmsStatus = {
  CallTimeout: 'CallTimeout',
  LimitExceed: 'LimitExceed'
};

export class SecurityPage extends React.Component<RootStoreProps> {
  private readonly profileStore = this.props.rootStore!.profileStore;
  private readonly uiStore = this.props.rootStore!.uiStore;
  private readonly analyticsService = this.props.rootStore!.analyticsService;

  @observable private code2fa = '';
  @observable private smsCode = '';
  @observable private error = '';
  @observable private isLoading = false;
  @observable private isSmsLoading = false;

  componentDidMount() {
    this.uiStore.activeHeaderMenuItem = MenuItem.Settings;
    window.scrollTo(0, 0);
    if (!this.profileStore.is2faEnabled) {
      this.profileStore.fetch2faCode();
    }
  }

  render() {
    const QR_SIZE = 190;
    const qrValue = `otpauth://totp/${this.profileStore.email}?secret=${this
      .profileStore.code2fa}`;

    return (
      <div className="security-page">
        <div className="container">
          <TfaDisabledBanner show={this.profileStore.is2faForbidden} />
          <h2 className="security-page__title">Security</h2>
          <div className="security-page__subtitle">
            Two-Factor Authentication
          </div>
          <div className="security-page__description">
            Two-Factor Authentication (2FA) enhances the security of your Lykke
            account and is required for crypto withdrawals and trading
          </div>
          <div
            className={classnames('tfa', {
              tfa_enabled: this.profileStore.is2faEnabled
            })}
          >
            <div className="security-page__tfa">
              <div className="tfa__status">
                <div className="tfa__title">
                  <img
                    src={`${process.env.PUBLIC_URL}/images/google-auth.svg`}
                  />
                  Google Authenticator
                </div>
                {this.profileStore.is2faForbidden ? (
                  <div className="tfa__badge tfa__badge_warning">Forbidden</div>
                ) : (
                  <div className="tfa__badge">Enabled</div>
                )}
              </div>
              <div className="tfa__qr">
                <QRCode size={QR_SIZE} value={qrValue} />
              </div>
              <div className="tfa__block">
                <div className="tfa__title">
                  <img
                    src={`${process.env.PUBLIC_URL}/images/google-auth.svg`}
                  />
                  Google Authenticator
                </div>
                <div className="tfa__description">
                  Download and install Google Authenticator. Scan the QR code or
                  copy the key:
                </div>
                <div className="tfa__input">
                  <input
                    type="text"
                    readOnly
                    className="form-control disabled"
                    value={this.profileStore.code2fa}
                  />
                </div>
                <div className="tfa__links">
                  <a
                    href="https://itunes.apple.com/us/app/google-authenticator/id388497605?mt=8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="app-link"
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/images/apple-icn.svg`}
                      alt="App Store"
                    />
                    App Store
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="app-link"
                  >
                    <img
                      src={`${process.env
                        .PUBLIC_URL}/images/google-play-icn.svg`}
                      alt="Google Play"
                    />
                    Google Play
                  </a>
                </div>
              </div>
            </div>
            <div className="tfa__form">
              <label htmlFor="code" className="control-label">
                SMS Code
              </label>
              <div className={classnames('form-group form-group_sms')}>
                <div className="error-bar" />
                <TextMask
                  className="form-control"
                  mask={[/\d/, /\d/, /\d/, /\d/]}
                  name="smsCode"
                  id="smsCode"
                  guide={false}
                  // tslint:disable-next-line:jsx-no-lambda
                  onChange={(e: any) => (this.smsCode = e.currentTarget.value)}
                  value={this.smsCode}
                />
                <button
                  className="btn btn-primary"
                  onClick={this.sendSms}
                  disabled={this.isSmsLoading}
                >
                  Get code
                </button>
              </div>
              <label htmlFor="code" className="control-label">
                2FA Code
              </label>
              <div className={classnames('form-group')}>
                <div className="error-bar" />
                <TextMask
                  className="form-control"
                  mask={[/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/]}
                  name="code"
                  id="code"
                  guide={false}
                  // tslint:disable-next-line:jsx-no-lambda
                  onChange={(e: any) =>
                    (this.code2fa = e.currentTarget.value.replace(' ', ''))}
                  value={this.code2fa}
                />
              </div>
              {this.error && (
                <span
                  className="help-block"
                  dangerouslySetInnerHTML={{__html: this.error}}
                />
              )}
              <button
                className="btn btn-primary tfa__btn"
                onClick={this.toggle2fa}
                disabled={!this.smsCode || !this.code2fa || this.isLoading}
              >
                Submit
              </button>
            </div>
            <div
              className={classnames('security-page__description', {
                hidden: !this.profileStore.is2faEnabled
              })}
            >
              For any issues with your configuration of Two-Factor
              Authentication please contact support at{' '}
              <a className="link" href="mailto:support@lykke.com">
                support@lykke.com
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private sendSms = async () => {
    if (!this.isSmsLoading) {
      this.isSmsLoading = true;
      this.error = '';
      const res = await this.profileStore.sendSmsCode();
      if (res.Status === SmsStatus.CallTimeout) {
        this.error = 'Please try again in one minute';
      }
      if (res.Status === SmsStatus.LimitExceed) {
        this.error =
          'Feature was temporarily disabled, please contact <a href="mailto:support@lykke.com">support@lykke.com</a>';
      }
      this.isSmsLoading = false;
    }
  };

  private toggle2fa = async (e: React.MouseEvent<any>) => {
    e.preventDefault();
    if (!this.isLoading) {
      this.isLoading = true;
      this.error = '';
      const isValid = await this.profileStore.enable2fa(
        this.code2fa,
        this.smsCode
      );
      if (isValid) {
        this.analyticsService.track(AnalyticsEvent.Enable2fa);
        window.scrollTo(0, 0);
      } else {
        this.error = 'Invalid sms or 2fa code';
      }
      this.isLoading = false;
    }
  };
}

export default inject(STORE_ROOT)(observer(SecurityPage));
