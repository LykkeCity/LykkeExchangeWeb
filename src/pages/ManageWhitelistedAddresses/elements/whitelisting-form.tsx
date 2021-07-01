import classnames from 'classnames';
import React from 'react';
import {WhitelistingErrorCodes} from '..';
import WhitelistingModel from '../../../models/whitelistingModel';

interface Props {
  isSubmitting: boolean;
  selectedItem?: WhitelistingModel;
  addSubmit: (
    name: string,
    addressBase: string,
    addressExtension: string,
    code2fa: string
  ) => Promise<WhitelistingErrorCodes>;
  deleteSubmit: (code2fa: string) => Promise<WhitelistingErrorCodes>;
  cancelClick: () => void;
}

export class WhitelistingForm extends React.Component<Props> {
  state = {
    addressBase: this.props.selectedItem
      ? this.props.selectedItem.addressBase
      : '',
    addressBaseInvalid: false,
    addressExtension: this.props.selectedItem
      ? this.props.selectedItem.addressExtension || '--'
      : '',
    addressExtensionInvalid: false,
    code2fa: '',
    code2faInvalid: false,
    name: this.props.selectedItem ? this.props.selectedItem.name : '',
    nameInvalid: false,
    submitErrorCode: 'None' as WhitelistingErrorCodes
  };

  private get isFormValid() {
    return this.props.selectedItem
      ? !this.state.code2faInvalid
      : !this.state.nameInvalid &&
          !this.state.addressBaseInvalid &&
          !this.state.addressExtensionInvalid &&
          !this.state.code2faInvalid;
  }

  private get submitErrorMessage() {
    switch (this.state.submitErrorCode) {
      case 'TwoFactorRequired':
        return 'The action requires 2fa enabled.';
      case 'SecondFactorCheckForbiden':
        return '2FA check forbidden.';
      case 'AssetUnavailable':
        return 'The requested asset is unavailable for the current action.';
      case 'BlockchainWalletDepositAddressNotGenerated':
        return 'The deposit address is not generated.';
      case 'AddressAlreadyWhitelisted':
        return 'Suggested address has already been whitelisted.';
      case 'Unknown':
      default:
        return 'Something went wrong.';
    }
  }

  render() {
    return (
      <form className="whitelisting-form">
        <div className="form-group">
          <label htmlFor="name" className="control-label">
            Name
          </label>
          <input
            autoFocus={!this.props.selectedItem}
            disabled={!!this.props.selectedItem}
            id="name"
            value={this.state.name}
            onChange={this.handleNameChange}
            onBlur={this.validateName}
            className={classnames('form-control', {
              'form-control--error': this.state.nameInvalid
            })}
          />
          {this.state.nameInvalid && (
            <div className="label_error">Please input Name</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="addressBase" className="control-label">
            Address
          </label>
          <input
            disabled={!!this.props.selectedItem}
            id="addressBase"
            value={this.state.addressBase}
            onChange={this.handleAddressBaseChange}
            onBlur={this.validateAddressBase}
            className={classnames('form-control', {
              'form-control--error': this.state.nameInvalid
            })}
          />
          {this.state.addressBaseInvalid && (
            <div className="label_error">Please input Address</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="addressExtension" className="control-label">
            Memo/Tag
          </label>
          <input
            disabled={!!this.props.selectedItem}
            id="addressExtension"
            value={this.state.addressExtension}
            onChange={this.handleAddressExtensionChange}
            onBlur={this.validateAddressExtension}
            className={classnames('form-control', {
              'form-control--error': this.state.nameInvalid
            })}
          />
          {this.state.addressExtensionInvalid && (
            <div className="label_error">Please input Memo/Tag</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="code2fa" className="control-label">
            2FA Code
          </label>
          <input
            autoFocus={!!this.props.selectedItem}
            id="code2fa"
            value={this.state.code2fa}
            onChange={this.handle2faCodeChange}
            onBlur={this.validate2faCode}
            className={classnames('form-control', {
              'form-control--error': this.state.code2faInvalid
            })}
          />
          {this.state.code2faInvalid && (
            <div className="label_error">Please input 2FA Code</div>
          )}
        </div>
        <div className="drawer__footer">
          <div className="submit-note">
            Any changes made on this address will become operational in 48 hours
          </div>
          {this.props.selectedItem && (
            <button
              className="btn btn--primary pull-right"
              type="submit"
              onClick={this.handleSubmitDelete}
              disabled={!this.isFormValid || this.props.isSubmitting}
            >
              Remove
            </button>
          )}
          {!this.props.selectedItem && (
            <button
              className="btn btn--primary pull-right"
              type="submit"
              onClick={this.handleSubmitAdd}
              disabled={!this.isFormValid || this.props.isSubmitting}
            >
              Add
            </button>
          )}
          <button
            className="btn btn--flat"
            type="button"
            onClick={this.props.cancelClick}
          >
            Cancel and close
          </button>
          {this.state.submitErrorCode !== 'None' && (
            <div className="label_error">{this.submitErrorMessage}</div>
          )}
        </div>
      </form>
    );
  }

  private handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({name: e.currentTarget.value});
    if (this.state.nameInvalid) {
      this.validateName();
    }
  };

  private handleAddressBaseChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({addressBase: e.currentTarget.value});
    if (this.state.addressBaseInvalid) {
      this.validateAddressBase();
    }
  };

  private handleAddressExtensionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({addressExtension: e.currentTarget.value});
    if (this.state.addressExtensionInvalid) {
      this.validateAddressExtension();
    }
  };

  private handle2faCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({code2fa: e.currentTarget.value});
    if (this.state.code2faInvalid) {
      this.validate2faCode();
    }
  };

  private validateForm = () => {
    return this.props.selectedItem
      ? this.validate2faCode()
      : [
          this.validateName(),
          this.validateAddressBase(),
          this.validateAddressExtension(),
          this.validate2faCode()
        ].every(x => x);
  };

  private validateName = () => {
    this.setState({nameInvalid: !this.state.name});
    return !this.state.nameInvalid;
  };

  private validateAddressBase = () => {
    this.setState({addressBaseInvalid: !this.state.addressBase});
    return !this.state.addressBaseInvalid;
  };

  private validateAddressExtension = () => {
    this.setState({addressExtensionInvalid: !this.state.addressExtension});
    return !this.state.addressExtensionInvalid;
  };

  private validate2faCode = () => {
    this.setState({code2faInvalid: !this.state.code2fa});
    return !this.state.code2faInvalid;
  };

  private handleSubmitAdd = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    const submitErrorCode = await this.props.addSubmit(
      this.state.name,
      this.state.addressBase,
      this.state.addressExtension,
      this.state.code2fa
    );
    this.setState({submitErrorCode});
  };

  private handleSubmitDelete = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    const submitErrorCode = await this.props.deleteSubmit(this.state.code2fa);
    this.setState({submitErrorCode});
  };
}
