import {Icon, Modal} from 'antd';
import Input from 'antd/lib/input/Input';
import Popover from 'antd/lib/popover';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {InjectedRootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models';

interface GenerateWalletKeyFormProps extends InjectedRootStoreProps {
  wallet: WalletModel;
}

export class GenerateWalletKeyForm extends React.Component<
  GenerateWalletKeyFormProps
> {
  render() {
    return (
      <div>
        <Input
          id="walletKey"
          name="walletKey"
          defaultValue={this.props.wallet.apiKey}
          readOnly={true}
          suffix={[
            <Popover
              key={'regen'}
              title="Regenerate a new API key"
              placement="topLeft"
            >
              <Icon type="key" onClick={this.handleRegenerateKey} />
            </Popover>,
            <Icon key={'copy'} type="copy" onClick={this.handleCopyKey} />
          ]}
        />
      </div>
    );
  }

  private readonly showConfirm = () =>
    Modal.confirm({
      cancelText: 'No, back to wallet',
      content:
        'This acction is unreversible. Your previous API key will become invalid',
      okText: 'Yes, change API key',
      onOk: () => {
        this.props.rootStore!.walletStore.regenerateApiKey(this.props.wallet);
      },
      title: 'Do you want to regenerate API key?'
    });

  private readonly handleRegenerateKey = () => {
    this.showConfirm();
  };

  private readonly handleCopyKey = () => {
    try {
      (document.querySelector('#walletKey') as HTMLInputElement).select();
      document.execCommand('copy');
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error('Unable to copy');
    }
  };
}

export default inject(STORE_ROOT)(observer(GenerateWalletKeyForm));
