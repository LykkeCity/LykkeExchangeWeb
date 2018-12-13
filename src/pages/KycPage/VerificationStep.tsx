import {computed, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import {padStart} from '../../utils';

// tslint:disable-next-line:no-var-requires
const ReactCodeInput = require('react-code-input').default;

import './style.css';

export interface VerificationStepProps extends RootStoreProps {
  title: string;
  description: string;
  hint: string;
  buttonText: string;
  onSubmit: () => void;
}

const CODE_SIZE = 5;

export class VerificationStep extends React.Component<VerificationStepProps> {
  @observable code = '';
  @observable timerSeconds = 59;
  @observable timerTimeout: number;

  @computed
  get canResendCode() {
    return this.timerSeconds === 0;
  }

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    if (this.timerTimeout) {
      window.clearTimeout(this.timerTimeout);
    }
  }

  render() {
    return (
      <div className="verification">
        <div className="verification__title">{this.props.title}</div>
        <div className="verification__description">
          {this.props.description}
        </div>
        <div className="verification__code">
          <ReactCodeInput
            type="text"
            fields={CODE_SIZE}
            onChange={this.handleCodeChanged}
            inputStyle={{
              border: '1px solid #cfd2d7',
              borderRadius: '4px',
              color: '#111',
              fontWeight: '600',
              height: '70px',
              marginRight: '10px',
              textAlign: 'center',
              width: '50px'
            }}
          />
        </div>
        <div className="verification__hint">{this.props.hint}</div>
        <input
          type="submit"
          value={this.props.buttonText}
          className="btn btn--primary verification__button"
          onClick={this.props.onSubmit}
          disabled={this.code.length < CODE_SIZE}
        />
        {this.canResendCode ? (
          <div>
            <div className="verification__resend-hint">
              Didn’t received the code?
            </div>
            <div className="verification__resend-link">
              <a href="#" onClick={this.handleResendClick}>
                Resend code
              </a>
            </div>
          </div>
        ) : (
          <div>
            <div className="verification__resend-hint">
              If you haven't received the code, you will be able to request a
              new one in
            </div>
            <div className="verification__timer">
              <img
                src={`${process.env
                  .PUBLIC_URL}/images/lw-wallet-icon-timer.svg`}
              />
              <span>00:{padStart(this.timerSeconds.toString(), 2, '0')}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  private handleCodeChanged = (value: string) => {
    this.code = value;
  };

  private handleResendClick = (ev: any) => {
    ev.preventDefault();
    this.startTimer();
  };

  private timerTick = () => {
    this.timerSeconds--;
    if (this.timerSeconds > 0) {
      this.timerTimeout = window.setTimeout(this.timerTick, 1000);
    }
  };

  private startTimer = () => {
    this.timerSeconds = 59;
    this.timerTimeout = window.setTimeout(this.timerTick, 1000);
  };
}

export default inject(STORE_ROOT)(observer(VerificationStep));
