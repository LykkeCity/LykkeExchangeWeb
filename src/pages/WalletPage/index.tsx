import Button from 'antd/lib/button/button';
import 'antd/lib/modal/style/css';
import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Route} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import CreateWalletForm from '../../components/CreateWalletForm';
import CreateWalletWizard, {
  Step,
  Steps
} from '../../components/CreateWalletWizard';
import Drawer from '../../components/Drawer';
import GenerateWalletKeyForm from '../../components/GenerateWalletKeyForm';
import WalletList from '../../components/WalletList';
import {ROUTE_WALLET} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models';

export class WalletPage extends React.Component<RootStoreProps> {
  private readonly walletStore = this.props.rootStore!.walletStore;
  private readonly uiStore = this.props.rootStore!.uiStore;

  @observable private wallet = new WalletModel(this.walletStore);
  @observable private activeStep = 1;

  render() {
    return (
      <div className="container">
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
                onCancel={this.uiStore.toggleCreateWalletDrawer}
                onNext={this.handleCreateWallet}
                index={1}
              >
                <CreateWalletForm
                  onChangeName={this.handleChangeWalletName}
                  onSubmit={this.handleCreateWallet}
                  onCancel={this.uiStore.toggleCreateWalletDrawer}
                  onChangeDesc={this.handleChangeWalletDesc}
                />
              </Step>
              <Step
                title="Generate API key"
                onCancel={this.uiStore.toggleCreateWalletDrawer}
                onNext={this.handleCreateWallet}
                index={2}
              >
                <GenerateWalletKeyForm wallet={this.wallet} />
                <div className="drawer__footer">
                  <Button
                    onClick={this.uiStore.toggleCreateWalletDrawer}
                    type="primary"
                  >
                    Finish
                  </Button>
                </div>
              </Step>
            </Steps>
          </CreateWalletWizard>
        </Drawer>
        <Route exact={true} path={ROUTE_WALLET} component={WalletList} />
      </div>
    );
  }

  private readonly handleChangeWalletName = (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    this.wallet.title = e.currentTarget.value;
  };
  private readonly handleChangeWalletDesc = (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    this.wallet.desc = e.currentTarget.value;
  };

  private readonly handleCreateWallet = async () => {
    this.wallet = await this.walletStore.createApiWallet(this.wallet);
    this.activeStep++;
  };
}

export default inject(STORE_ROOT)(observer(WalletPage));
