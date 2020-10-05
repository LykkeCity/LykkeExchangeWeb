import * as classNames from 'classnames';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import * as React from 'react';
import {WalletModel} from '../../models/index';

interface WalletFormProps {
  wallet: WalletModel;
  onChangeName: React.ChangeEventHandler<HTMLInputElement>;
  onChangeDesc?: React.ChangeEventHandler<any>;
  onSubmit: React.MouseEventHandler<any>;
  onCancel: React.MouseEventHandler<any>;
}

export class WalletForm extends React.Component<WalletFormProps> {
  @observable hasErrors = false;
  @observable isDirty = false;
  @observable isSubmitting = false;

  render() {
    return (
      <form>
        <div className="form-group">
          <label htmlFor="name" className="control-label">
            Name of wallet
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className={classNames('form-control', {
              'form-control--error': this.hasErrors
            })}
            required={true}
            value={this.props.wallet.title}
            onChange={this.handleChangeName}
            autoFocus={true}
            onBlur={this.handleBlur}
          />
          {this.hasErrors && (
            <div className="label_error">
              Please input the name of the wallet
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="desc" className="control-label">
            Description
          </label>
          <textarea
            id="desc"
            name="desc"
            value={this.props.wallet.desc}
            onChange={this.props.onChangeDesc}
            placeholder="Put your description, like My API Wallet"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label className="control-label" onClick={this.toggleOptions}>
            Options{' '}
            <i
              className={classNames(
                'icon',
                this.props.wallet.optionsExanded
                  ? 'icon--chevron-thin-up'
                  : 'icon--chevron-thin-down'
              )}
            />
          </label>
          {this.props.wallet.optionsExanded && (
            <div>
              <div className="form-group">
                <div className="checkbox">
                  <input
                    type="checkbox"
                    name="apiv2Only"
                    id="apiv2Only"
                    className="radio__control"
                    defaultChecked={this.props.wallet.apiv2Only}
                    onChange={this.toggleApiv2Only}
                  />
                  <label
                    htmlFor="apiv2Only"
                    className="control-label checkbox__label"
                  >
                    Use in api v2 only
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="drawer__footer">
          <button
            className="btn btn--primary pull-right"
            type="button"
            onClick={this.handleSubmit}
            disabled={!this.props.wallet.isValid || this.isSubmitting}
          >
            Generate API Key
          </button>
          <button
            className="btn btn--flat"
            type="button"
            onClick={this.props.onCancel}
          >
            Cancel and close
          </button>
        </div>
      </form>
    );
  }

  private handleChangeName: React.ChangeEventHandler<HTMLInputElement> = e => {
    this.isDirty = true;
    this.props.onChangeName(e);
    this.validateForm();
  };

  private handleSubmit: React.MouseEventHandler<any> = e => {
    this.validateForm();
    if (this.props.wallet.isValid) {
      this.isSubmitting = true;
      this.props.onSubmit(e);
    }
  };

  private handleBlur = () => {
    this.validateForm();
  };

  private validateForm = () => {
    this.hasErrors = this.isDirty && !this.props.wallet.isValid;
  };

  private toggleOptions = () => {
    this.props.wallet.optionsExanded = !this.props.wallet.optionsExanded;
  };

  private toggleApiv2Only = () => {
    this.props.wallet.apiv2Only = !this.props.wallet.apiv2Only;
  };
}

export default observer(WalletForm);
