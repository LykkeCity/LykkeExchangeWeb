import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models';
import Drawer from '../Drawer';
import EditWalletForm from '../EditWalletForm/index';
import {Wizard, WizardStep} from '../Wizard';

interface EditWalletDrawerProps extends RootStoreProps {
  wallet?: WalletModel;
  show?: boolean;
}

export class EditWalletDrawer extends React.Component<EditWalletDrawerProps> {
  private readonly walletStore = this.props.rootStore!.walletStore;
  private readonly uiStore = this.props.rootStore!.uiStore;

  @observable private wallet = this.walletStore.selectedWallet;
  @observable private show = this.uiStore.showWalletDrawer || false;

  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <Drawer title="Edit Wallet" show={this.show}>
        <div className="drawer__title">
          <h2>{this.wallet ? this.wallet.title : ''}</h2>
          <h3>API Wallet</h3>
        </div>
        <Wizard activeIndex={1}>
          <WizardStep
            title="Name and description"
            onCancel={null}
            onNext={null}
            index={1}
          >
            {this.wallet ? <EditWalletForm /> : null}
          </WizardStep>
        </Wizard>
      </Drawer>
    );
  }
}

export default inject(STORE_ROOT)(observer(EditWalletDrawer));
