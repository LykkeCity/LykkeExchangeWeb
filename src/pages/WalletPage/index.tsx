import Button from 'antd/lib/button/button';
import 'antd/lib/modal/style/css';
import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {InjectedRootStoreProps} from '../../App';
import CreateWalletForm from '../../components/CreateWalletForm';
import CreateWalletWizard, {
  Step,
  Steps
} from '../../components/CreateWalletWizard';
import Drawer from '../../components/Drawer';
import GenerateWalletKeyForm from '../../components/GenerateWalletKeyForm';
import WalletList from '../../components/WalletList';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models';

export class WalletPage extends React.Component<InjectedRootStoreProps> {
  private readonly walletStore = this.props.rootStore!.walletStore;
  private readonly uiStore = this.props.rootStore!.uiStore;

  @observable private wallet = new WalletModel(this.walletStore);
  @observable private activeStep = 1;

  componentDidMount() {
    this.walletStore.fetchWallets();
  }

  render() {
    return (
      <div className="container">
        <WalletList loading={this.walletStore.loading} />
        <Drawer
          title="New API Wallet"
          show={this.uiStore.showCreateWalletDrawer}
        >
          <h2>New Wallet</h2>
          <h3>API Wallet</h3>
          <CreateWalletWizard>
            <Steps activeIndex={this.activeStep}>
              <Step
                title="Name of wallet"
                onHide={this.uiStore.toggleCreateWalletDrawer}
                onNext={this.handleCreateWallet}
                index={1}
              >
                <CreateWalletForm onChangeName={this.handleChangeWalletName} />
                <div className="drawer__footer">
                  <Button
                    onClick={this.uiStore.toggleCreateWalletDrawer}
                    type="ghost"
                  >
                    Cancel and close
                  </Button>
                  <Button onClick={this.handleCreateWallet} type="primary">
                    Ok
                  </Button>
                </div>
              </Step>
              <Step
                title="Generate API key"
                onHide={this.uiStore.toggleCreateWalletDrawer}
                onNext={this.handleCreateWallet}
                index={2}
              >
                <GenerateWalletKeyForm wallet={this.wallet} />
                <div className="drawer__footer">
                  <Button
                    onClick={this.uiStore.toggleCreateWalletDrawer}
                    type="primary"
                  >
                    Ok
                  </Button>
                </div>
              </Step>
            </Steps>
          </CreateWalletWizard>
        </Drawer>
      </div>
    );
  }

  private readonly handleChangeWalletName: React.EventHandler<
    React.ChangeEvent<HTMLInputElement>
  > = e => {
    this.wallet.title = e.currentTarget.value;
  };

  private readonly handleCreateWallet = async () => {
    this.wallet = await this.walletStore.createApiWallet(this.wallet.title);
    this.activeStep++;
  };
}

export default inject(STORE_ROOT)(observer(WalletPage));
