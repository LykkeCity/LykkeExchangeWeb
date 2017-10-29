import 'antd/lib/modal/style/css';
import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
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

export class WalletPage extends React.Component<RootStoreProps> {
  private readonly walletStore = this.props.rootStore!.walletStore;
  private readonly uiStore = this.props.rootStore!.uiStore;

  @observable private wallet = new WalletModel(this.walletStore);
  @observable private activeStep = 1;

  componentDidMount() {
    this.uiStore.startFetch(2);
    this.props.rootStore!.walletStore
      .fetchWallets()
      .then(() => this.uiStore.finishFetch());
    this.props.rootStore!.profileStore
      .fetchBaseCurrency()
      .then(() => this.uiStore.finishFetch(), () => this.uiStore.finishFetch());
  }

  render() {
    return (
      <div className="container">
        <WalletList loading={this.uiStore.hasPendingRequests} />
        <Drawer
          title="New API Wallet"
          show={this.uiStore.showCreateWalletDrawer}
        >
          <div className="drawer__title">
            <h2>New Wallet</h2>
            <h3>API Wallet</h3>
          </div>
          <CreateWalletWizard>
            <Steps activeIndex={this.activeStep}>
              <Step
                title="Name of wallet"
                onCancel={this.uiStore.toggleCreateWalletDrawer}
                onNext={this.handleCreateWallet}
                index={1}
              >
                <CreateWalletForm onChangeName={this.handleChangeWalletName} />
                <div className="drawer__footer">
                  <button
                    className="btn btn--flat"
                    type="button"
                    onClick={this.uiStore.toggleCreateWalletDrawer}
                  >
                    Cancel and close
                  </button>
                  <button
                    className="btn btn--primary"
                    type="button"
                    onClick={this.handleCreateWallet}
                  >
                    Generate API Key
                  </button>
                </div>
              </Step>
              <Step
                title="Generate API key"
                onCancel={this.uiStore.toggleCreateWalletDrawer}
                onNext={this.handleCreateWallet}
                index={2}
              >
                <GenerateWalletKeyForm wallet={this.wallet} />
                <div className="drawer__footer">
                  <button
                    className="btn btn--primary"
                    type="button"
                    onClick={this.uiStore.toggleCreateWalletDrawer}
                  >
                    Save
                  </button>
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
