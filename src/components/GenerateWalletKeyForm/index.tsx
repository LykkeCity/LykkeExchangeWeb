import {
  Dialog,
  Dropdown,
  DropdownContainer,
  DropdownControl
} from '@lykkex/react-components';
import classnames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models';

import './style.css';

const WALLET_KEY_INPUT = 'walletKey';

interface GenerateWalletKeyFormProps extends RootStoreProps {
  wallet: WalletModel;
}

export class GenerateWalletKeyForm extends React.Component<
  GenerateWalletKeyFormProps
> {
  state = {
    code2Fa: '',
    errorMessage: '',
    hideApiKey:
      this.props.wallet.apiKey === '00000000-0000-0000-0000-000000000000',
    isCodeValid: true,
    message: '',
    regenerateKeyTouched: false
  };

  render() {
    return (
      <div className="form-item generate-wallet-key-form">
        <div className="asset_link_list">
          <div className="asset_link">
            <div className="asset_link__info">
              <div className="asset_link__title">API Key</div>
              <div className="asset_link__desc">
                {this.state.hideApiKey
                  ? '********-****-****-****-************'
                  : this.props.wallet.apiKey}
                <input
                  id={WALLET_KEY_INPUT}
                  name={WALLET_KEY_INPUT}
                  value={this.props.wallet.apiKey}
                  readOnly={true}
                  type="text"
                  className="hidden_field"
                />
              </div>
            </div>
            <div
              className="asset_link__action"
              onTouchStartCapture={this.handleRegenerateKeyTouchStart}
            >
              <Dropdown
                isTooltip
                className={classnames({
                  dropdown_touched: this.state.regenerateKeyTouched
                })}
              >
                <DropdownControl>
                  <button
                    className="btn btn--icon"
                    type="button"
                    onClick={this.handleRegenerateKeyClick}
                  >
                    <i className="icon icon--key" />
                  </button>
                </DropdownControl>
                <DropdownContainer>
                  <div className="regenerate-button-tooltip">
                    Regenerate a new API key
                  </div>
                </DropdownContainer>
              </Dropdown>
            </div>
            <div style={{position: 'relative'}} className="asset_link__action">
              {this.state.hideApiKey ? (
                <button className="btn btn--icon disabled" type="button">
                  <i className="icon icon--copy_thin" />
                </button>
              ) : (
                <CopyToClipboard
                  text={this.props.wallet.apiKey}
                  onCopy={this.handleCopyKey}
                >
                  <button className="btn btn--icon" type="button">
                    <i className="icon icon--copy_thin" />
                  </button>
                </CopyToClipboard>
              )}

              {!!this.state.message && (
                <small
                  style={{
                    color: 'green',
                    fontWeight: 'normal',
                    position: 'absolute',
                    right: '1em',
                    top: '3em'
                  }}
                >
                  {this.state.message}
                </small>
              )}
            </div>
          </div>
        </div>
        <div>
          Api key is visibile and can be copied only within 5 minutes after the
          creation
        </div>
        <Dialog
          className="regenerate-api-key-modal"
          visible={this.props.rootStore!.uiStore.showConfirmRegenerateKey}
          onCancel={this.toggleConfirm}
          onConfirm={this.handleRegenerateKey}
          confirmButton={{text: 'Yes, Change API Key'}}
          cancelButton={{text: 'No, Back to Wallet'}}
          title="Regenerate API key?"
          description={
            <span>
              This action is irreversible!
              <br />Previous API key will become invalid<br />
              <br />
              <div
                className={classnames('form-group', {
                  'has-error': !this.state.isCodeValid
                })}
              >
                <div className="row">
                  <div className="col-sm-4">
                    <label htmlFor="tr_code2fa" className="control-label">
                      2FA code
                    </label>
                  </div>
                  <div className="col-sm-8">
                    <div className="error-bar" />
                    <input
                      type="text"
                      id="tr_code2Fa"
                      name="code2Fa"
                      className="form-control"
                      onChange={this.handleChange2Fa}
                    />
                    {!this.state.isCodeValid && (
                      <span className="help-block">
                        {this.state.errorMessage}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </span>
          }
        />
      </div>
    );
  }

  private handleRegenerateKeyClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.toggleConfirm();
  };

  private toggleConfirm = () =>
    this.props.rootStore!.uiStore.toggleConfirmRegenerateKey();

  private handleChange2Fa = (e: any) => {
    this.setState({code2Fa: e.currentTarget.value});
  };

  private handleRegenerateKey = async () => {
    const result = await this.props.rootStore!.walletStore.regenerateApiKey(
      this.props.wallet,
      this.state.code2Fa
    );
    if (!!result.IsCodeValid) {
      this.toggleConfirm();
    } else {
      this.setState({
        errorMessage: result.Error.Message,
        isCodeValid: !!result.IsCodeValid
      });
    }
  };

  private readonly handleCopyKey = (text: string) => {
    if (!!text) {
      this.setState({message: 'Copied!'});
      setTimeout(() => {
        this.setState({message: ''});
      }, 2000);
    }
  };

  private handleRegenerateKeyTouchStart = (
    e: React.TouchEvent<HTMLDivElement>
  ) => {
    this.setState({regenerateKeyTouched: true});
  };
}

export default inject(STORE_ROOT)(observer(GenerateWalletKeyForm));
