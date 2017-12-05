import Modal from 'antd/lib/modal/Modal';
import {observer} from 'mobx-react';
import * as React from 'react';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import {WalletModel} from '../../models';

const WALLET_KEY_INPUT = 'walletKey';

interface GenerateWalletKeyFormProps {
  wallet: WalletModel;
  isShowConfirm: boolean;
  onToggleConfirm: () => void;
  onRegenerateApiKey: (w: WalletModel) => void;
}

export class GenerateWalletKeyForm extends React.Component<
  GenerateWalletKeyFormProps
> {
  state = {message: ''};
  private readonly onToggleConfirm = this.props.onToggleConfirm;
  private readonly onRegenerateApiKey = this.props.onRegenerateApiKey;

  render() {
    const {isShowConfirm} = this.props;
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
                onClick={this.onToggleConfirm}
              >
                <i className="icon icon--key" />
              </button>
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
          visible={isShowConfirm}
          title="Regenerate API key?"
          onOk={this.onToggleConfirm}
          onCancel={this.onToggleConfirm}
          footer={[
            <button
              key="back"
              type="button"
              className="btn btn--primary btn-block"
              onClick={this.onToggleConfirm}
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

  private handleRegenerateKey = (event: React.MouseEvent<any>) => {
    this.onToggleConfirm();
    this.onRegenerateApiKey(this.props.wallet);
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

export default observer(GenerateWalletKeyForm);
