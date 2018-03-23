import Modal from 'antd/lib/modal/Modal';
import {
  Dropdown,
  DropdownContainer,
  DropdownControl
} from 'lykke-react-components';
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
  state = {message: ''};

  render() {
    return (
      <div className="form-item generate-wallet-key-form">
        <div className="asset_link_list">
          <div className="asset_link">
            <div className="asset_link__info">
              <div className="asset_link__title">API Key</div>
              <div className="asset_link__desc">
                {this.props.wallet.apiKey}
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
            <div className="asset_link__action">
              <Dropdown isTooltip>
                <DropdownControl>
                  <button
                    className="btn btn--icon"
                    type="button"
                    onClick={this.toggleConfirm}
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
              <CopyToClipboard
                text={this.props.wallet.apiKey}
                onCopy={this.handleCopyKey}
              >
                <button className="btn btn--icon" type="button">
                  <i className="icon icon--copy_thin" />
                </button>
              </CopyToClipboard>
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
        <Modal
          visible={this.props.rootStore!.uiStore.showConfirmRegenerateKey}
          title="Regenerate API key?"
          onOk={this.toggleConfirm}
          onCancel={this.toggleConfirm}
          footer={[
            <button
              key="back"
              type="button"
              className="btn btn--primary btn-block"
              onClick={this.toggleConfirm}
            >
              No, back to wallet
            </button>,
            <button
              key="submit"
              className="btn btn--flat btn-block"
              onClick={this.handleRegenerateKey}
            >
              Yes, change API key
            </button>
          ]}
          style={{margin: '0 auto'}}
        >
          <div className="modal__text">
            <p>This action is irreversible!</p>
            <p>Previous API key will become invalid</p>
          </div>
        </Modal>
      </div>
    );
  }

  private toggleConfirm = () =>
    this.props.rootStore!.uiStore.toggleConfirmRegenerateKey();

  private handleRegenerateKey = () => {
    this.toggleConfirm();
    this.props.rootStore!.walletStore.regenerateApiKey(this.props.wallet);
  };

  private readonly handleCopyKey = (text: string) => {
    if (!!text) {
      this.setState({message: 'Copied!'});
      setTimeout(() => {
        this.setState({message: ''});
      }, 2000);
    }
  };
}

export default inject(STORE_ROOT)(observer(GenerateWalletKeyForm));
