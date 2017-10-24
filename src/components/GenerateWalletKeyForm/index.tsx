import {Icon} from 'antd';
import Button from 'antd/lib/button/button';
import Input from 'antd/lib/input/Input';
import Modal from 'antd/lib/modal/Modal';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {InjectedRootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models';

const WALLET_KEY_INPUT = 'walletKey';

interface GenerateWalletKeyFormProps extends InjectedRootStoreProps {
  wallet: WalletModel;
}

export class GenerateWalletKeyForm extends React.Component<
  GenerateWalletKeyFormProps
> {
  render() {
    return (
      <div className="form-item">
        <div className="form-item-label">
          <label>API Key</label>
        </div>
        <Input
          id={WALLET_KEY_INPUT}
          name={WALLET_KEY_INPUT}
          value={this.props.wallet.apiKey}
          readOnly={true}
          suffix={[
            <Icon
              key="regenKey"
              type="key"
              onClick={this.toggleConfirm}
              title="Regenerate API Key"
            />,
            <Icon key="copyKey" type="copy" onClick={this.handleCopyKey} />
          ]}
        />
        <Modal
          visible={this.props.rootStore!.uiStore.showConfirmRegenerateKey}
          title="Regenerate API key?"
          onOk={this.toggleConfirm}
          onCancel={this.toggleConfirm}
          footer={[
            <Button key="back" type="primary" onClick={this.toggleConfirm}>
              No, back to wallet
            </Button>,
            <Button
              key="submit"
              size="large"
              onClick={this.handleRegenerateKey}
            >
              Yes, change API key
            </Button>
          ]}
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
