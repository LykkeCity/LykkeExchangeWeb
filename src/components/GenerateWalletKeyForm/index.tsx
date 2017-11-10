import Modal from 'antd/lib/modal/Modal';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models';

const WALLET_KEY_INPUT = 'walletKey';

interface GenerateWalletKeyFormProps extends RootStoreProps {
  wallet: WalletModel;
}

export class GenerateWalletKeyForm extends React.Component<
  GenerateWalletKeyFormProps
> {
  render() {
    return (
      <div className="form-item">
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
              <button
                className="btn btn--icon"
                type="button"
                onClick={this.toggleConfirm}
              >
                <i className="icon icon--key" />
              </button>
            </div>
            <div className="asset_link__action">
              <button
                className="btn btn--icon"
                type="button"
                onClick={this.handleCopyKey}
              >
                <i className="icon icon--copy_thin" />
              </button>
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

  private readonly handleCopyKey = () => {
    try {
      const input = document.getElementById(WALLET_KEY_INPUT);
      (input as HTMLInputElement).select();
      document.execCommand('copy');
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error('Unable to copy');
    }
  };
}

export default inject(STORE_ROOT)(observer(GenerateWalletKeyForm));
