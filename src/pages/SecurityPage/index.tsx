import {MenuItem} from '@lykkex/react-components';
import classnames from 'classnames';
import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';

import './style.css';

// tslint:disable-next-line:no-var-requires
const QRCode = require('qrcode.react');

// tslint:disable-next-line:no-var-requires
const TextMask = require('react-text-mask').default;

export class SecurityPage extends React.Component<RootStoreProps> {
  private readonly profileStore = this.props.rootStore!.profileStore;
  private readonly uiStore = this.props.rootStore!.uiStore;

  @observable private code2fa = '';
  @observable private error = '';
  @observable private isLoading = false;

  componentDidMount() {
    this.uiStore.activeHeaderMenuItem = MenuItem.Profile;
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
          <h2 className="security-page__title">Security</h2>
          <div className="security-page__subtitle">
            Two-Factor Authentication
          </div>
          <div className="security-page__description">
            Two-Factor Authentication (2FA) enhances the security of your Lykke
            account and is required for all users. Each time you sign in to
            Lykke services, you will need your password and a verification code.
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
                <div className="tfa__badge">Enabled</div>
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
                2FA Code
              </label>
              <div
                className={classnames('form-group', {
                  'has-error': !!this.error
                })}
              >
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
                <button className="btn btn-primary" onClick={this.toggle2fa}>
                  Turn on
                </button>
              </div>
              {this.error && <span className="help-block">{this.error}</span>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  private toggle2fa = async (e: React.MouseEvent<any>) => {
    e.preventDefault();
    if (!this.isLoading) {
      this.isLoading = true;
      this.error = '';
      const isValid = await this.profileStore.enable2fa(this.code2fa);
      if (isValid) {
        window.scrollTo(0, 0);
      } else {
        this.error = 'Code not valid. Please try again.';
      }
      this.isLoading = false;
    }
  };
}

export default inject(STORE_ROOT)(observer(SecurityPage));
