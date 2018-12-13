import * as classnames from 'classnames';
import {action, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';

import './style.css';

export interface AccountInfoDropdownProps extends RootStoreProps {
  imageSrc: string;
  name: string;
  description: string;
  steps: string[];
}

export class AccountInfoDropdown extends React.Component<
  AccountInfoDropdownProps
> {
  @observable isOpened = false;

  render() {
    return (
      <div className="kyc-account-info-wrapper">
        <img src={this.props.imageSrc} />
        <div className="kyc-account-info">
          <div className="kyc-account-info__name">
            {this.props.name}
            <span className="chevron" onClick={this.toggle}>
              <img
                className={classnames({hidden: this.isOpened})}
                src={`${process.env.PUBLIC_URL}/images/arrow-down.png`}
              />
              <img
                className={classnames({hidden: !this.isOpened})}
                src={`${process.env.PUBLIC_URL}/images/arrow-right.png`}
              />
            </span>
          </div>
          {this.isOpened && (
            <div className="kyc-account-info__description">
              {this.props.description}
            </div>
          )}
          {this.isOpened && (
            <ul className="kyc-account-info__steps">
              {this.props.steps.map(step => (
                <li key={step}>
                  <span className="step-icon" />
                  {step}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  @action
  private toggle = () => {
    this.isOpened = !this.isOpened;
  };
}

export default inject(STORE_ROOT)(observer(AccountInfoDropdown));
