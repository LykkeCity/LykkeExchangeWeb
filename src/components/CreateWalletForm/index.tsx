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
            onChange={this.props.onChangeDesc}
            placeholder="Put your description, like My API Wallet"
            className="form-control"
          />
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
}

export default observer(WalletForm);
