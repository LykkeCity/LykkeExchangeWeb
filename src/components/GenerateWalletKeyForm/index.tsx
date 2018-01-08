import {inject, observer} from 'mobx-react';
import * as React from 'react';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models';
import {Button} from '../Button';
import Dropdown, {
  DROPDOWN_TRIGGER,
  DropdownItem,
  DropdownOverlay
} from '../Dropdown';
import {IconButton} from '../Icon';
import ModalDialog from '../ModalDialog';

const WALLET_KEY_INPUT = 'walletKey';

interface GenerateWalletKeyFormProps extends RootStoreProps {
  wallet: WalletModel;
}

class GenerateWalletKeyForm extends React.Component<
  GenerateWalletKeyFormProps
> {
  state = {message: ''};

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
              <Dropdown
                overlay={
                  <DropdownOverlay>
                    <DropdownItem onClick={this.toggleConfirm}>
                      Regenerate a new API key
                    </DropdownItem>
                  </DropdownOverlay>
                }
                trigger={[DROPDOWN_TRIGGER.HOVER]}
              >
                <div>
                  <IconButton name="key" onClick={this.toggleConfirm} />
                </div>
              </Dropdown>
            </div>
            <div style={{position: 'relative'}} className="asset_link__action">
              <CopyToClipboard
                text={this.props.wallet.apiKey}
                onCopy={this.handleCopyKey}
              >
                <IconButton name="copy_thin" />
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
        <ModalDialog
          visible={this.props.rootStore!.uiStore.showConfirmRegenerateKey}
          title="Regenerate API key?"
          onOk={this.toggleConfirm}
          onCancel={this.toggleConfirm}
          footer={[
            <Button key="back" width={290} onClick={this.toggleConfirm}>
              No, back to wallet
            </Button>,
            <Button
              key="submit"
              shape="flat"
              width={290}
              type="submit"
              onClick={this.handleRegenerateKey}
            >
              Yes, change API key
            </Button>
          ]}
          style={{margin: '0 auto'}}
        >
          <div className="modal__text">
            <p>This action is irreversible!</p>
            <p>Previous API key will become invalid</p>
          </div>
        </ModalDialog>
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
