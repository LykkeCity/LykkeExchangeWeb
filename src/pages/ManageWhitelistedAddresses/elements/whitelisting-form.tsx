import {Select} from '@lykkecity/react-components';
import classnames from 'classnames';
import React from 'react';
import {WhitelistingErrorCodes} from '..';
import TfaDisabledBanner from '../../../components/Banner/TfaDisabledBanner';
import CryptoOperationModel from '../../../models/cryptoOperationModel';
import {WalletDtoModel} from '../../../models/walletDtoModel';
import WhitelistingModel from '../../../models/whitelistingModel';

interface Props {
  isSubmitting: boolean;
  selectedItem?: WhitelistingModel;
  cryptoOperations: CryptoOperationModel[];
  wallets: WalletDtoModel[];
  addSubmit: (
    name: string,
    assetId: string,
    walletId: string,
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
    addressExtensionLabel: 'Memo/Tag',
    assetId: '',
    assetIdInvalid: false,
    code2fa: '',
    code2faInvalid: false,
    name: this.props.selectedItem ? this.props.selectedItem.name : '',
    nameInvalid: false,
    showTag: false,
    submitErrorCode: 'None' as WhitelistingErrorCodes,
    walletId: '',
    walletIdInvalid: false
  };

  private get isFormValid() {
    return this.props.selectedItem
      ? !this.state.code2faInvalid
      : !this.state.nameInvalid &&
          !this.state.addressBaseInvalid &&
          !this.state.code2faInvalid;
  }

  private get submitErrorMessage() {
    switch (this.state.submitErrorCode) {
      case 'TwoFactorRequired':
        return 'The action requires 2fa enabled.';
      case 'SecondFactorCheckForbiden':
        return '2FA check forbidden.';
      case 'SecondFactorCodeIncorrect':
        return 'The provided code for 2FA is incorrect.';
      case 'AssetUnavailable':
        return 'The requested asset is unavailable for the current action.';
      case 'BlockchainWalletDepositAddressNotGenerated':
        return 'The deposit address is not generated for selected wallet.';
      case 'AddressAlreadyWhitelisted':
        return 'Suggested address has already been whitelisted.';
      case 'Unknown':
      default:
        return 'Something went wrong.';
    }
  }

  render() {
    return (
      <form className="whitelisting-form" onSubmit={this.handleSubmitForm}>
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
        {!this.props.selectedItem && (
          <div className="form-group">
            <label htmlFor="asset" className="control-label">
              Asset
            </label>
            <Select
              className={classnames({
                'form-control--error': this.state.assetIdInvalid
              })}
              options={this.props.cryptoOperations}
              labelKey="displayId"
              valueKey="id"
              onChange={this.handleAssetIdChange}
              value={this.state.assetId}
              placeholder="Select..."
              searchPlaceholder="Enter asset or select from list..."
            />
            {this.state.assetIdInvalid && (
              <div className="label_error">Please select Asset</div>
            )}
          </div>
        )}
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
              'form-control--error': this.state.addressBaseInvalid
            })}
          />
          {this.state.addressBaseInvalid && (
            <div className="label_error">Please input Address</div>
          )}
        </div>
        {this.state.showTag && (
          <div className="form-group">
            <label htmlFor="addressExtension" className="control-label">
              {this.state.addressExtensionLabel}
            </label>
            <input
              disabled={!!this.props.selectedItem}
              id="addressExtension"
              value={this.state.addressExtension}
              onChange={this.handleAddressExtensionChange}
              className={classnames('form-control')}
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="wallet" className="control-label">
            Wallet
          </label>
          {this.props.selectedItem ? (
            <input
              disabled={true}
              id="wallet"
              value={this.props.selectedItem.walletName}
              className="form-control"
            />
          ) : (
            <Select
              className={classnames({
                'form-control--error': this.state.walletIdInvalid
              })}
              options={this.props.wallets}
              labelKey="name"
              valueKey="id"
              onChange={this.handleWalletIdChange}
              value={this.state.walletId}
              placeholder="Select..."
              searchPlaceholder="Enter wallet or select from list..."
            />
          )}
          {this.state.walletIdInvalid && (
            <div className="label_error">Please select Wallet</div>
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
              disabled={!this.isFormValid || this.props.isSubmitting}
            >
              Remove
            </button>
          )}
          {!this.props.selectedItem && (
            <button
              className="btn btn--primary pull-right"
              type="submit"
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
          {this.state.submitErrorCode !== 'None' &&
            (this.state.submitErrorCode === 'SecondFactorCheckForbiden' ? (
              <TfaDisabledBanner show={true} />
            ) : (
              <div className="label_error">
                {this.submitErrorMessage}
                {this.state.submitErrorCode ===
                  'BlockchainWalletDepositAddressNotGenerated' && (
                  <div>
                    Deposit address can be generated using{' '}
                    <a
                      target="_blank"
                      href="https://lykkecity.github.io/Trading-API/#create-deposit-addresses"
                    >
                      this
                    </a>{' '}
                    API.
                  </div>
                )}
              </div>
            ))}
        </div>
      </form>
    );
  }

  private handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({name: e.currentTarget.value});
    if (this.state.nameInvalid) {
      setTimeout(() => this.validateName(), 0);
    }
  };

  private handleAddressBaseChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({addressBase: e.currentTarget.value});
    if (this.state.addressBaseInvalid) {
      setTimeout(() => this.validateAddressBase(), 0);
    }
  };

  private handleAddressExtensionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({addressExtension: e.currentTarget.value});
  };

  private handleAssetIdChange = (item: CryptoOperationModel) => {
    this.setState({
      addressExtensionLabel: item.destinationTagLabel,
      assetId: item.id,
      showTag: item.destinationTagLabel != null
    });
    if (this.state.assetIdInvalid) {
      setTimeout(() => this.validateAssetId(), 0);
    }
  };

  private handleWalletIdChange = (item: WalletDtoModel) => {
    this.setState({walletId: item.id});
    if (this.state.walletIdInvalid) {
      setTimeout(() => this.validateWalletId(), 0);
    }
  };

  private handle2faCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({code2fa: e.currentTarget.value});
    if (this.state.code2faInvalid) {
      setTimeout(() => this.validate2faCode(), 0);
    }
  };

  private validateForm = () => {
    return this.props.selectedItem
      ? this.validate2faCode()
      : [
          this.validateName(),
          this.validateAddressBase(),
          this.validateAssetId(),
          this.validateWalletId(),
          this.validate2faCode()
        ].every(x => x);
  };

  private validateName = () => {
    const nameInvalid = !this.state.name;
    this.setState({nameInvalid});
    return !nameInvalid;
  };

  private validateAddressBase = () => {
    const addressBaseInvalid = !this.state.addressBase;
    this.setState({addressBaseInvalid});
    return !addressBaseInvalid;
  };

  private validateAssetId = () => {
    const assetIdInvalid = !this.state.assetId;
    this.setState({assetIdInvalid});
    return !assetIdInvalid;
  };

  private validateWalletId = () => {
    const walletIdInvalid = !this.state.walletId;
    this.setState({walletIdInvalid});
    return !walletIdInvalid;
  };

  private validate2faCode = () => {
    const code2faInvalid = !this.state.code2fa;
    this.setState({code2faInvalid});
    return !code2faInvalid;
  };

  private handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    this.props.selectedItem
      ? await this.handleDeleteSubmit(e)
      : await this.handleAddSubmit(e);
  };

  private handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    const submitErrorCode = await this.props.addSubmit(
      this.state.name,
      this.state.assetId,
      this.state.walletId,
      this.state.addressBase,
      this.state.addressExtension,
      this.state.code2fa
    );
    this.setState({submitErrorCode});
  };

  private handleDeleteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    const submitErrorCode = await this.props.deleteSubmit(this.state.code2fa);
    this.setState({submitErrorCode});
  };
}
