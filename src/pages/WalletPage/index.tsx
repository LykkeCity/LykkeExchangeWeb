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
import {loadable} from '../../components/hoc/loadable';
import WalletList from '../../components/WalletList';
import WalletTabs from '../../components/WalletTabs/index';
import {ROUTE_WALLETS} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models';

export class WalletPage extends React.Component<RootStoreProps> {
  private readonly walletStore = this.props.rootStore!.walletStore;
  private readonly uiStore = this.props.rootStore!.uiStore;
  private readonly transferStore = this.props.rootStore!.transferStore;

  @observable private wallet = new WalletModel(this.walletStore);
  @observable private activeStep = 1;

  constructor(props: any) {
    super(props);
    this.transferStore.resetCurrentTransfer();
  }

  componentDidMount() {
    this.uiStore.startRequest();
    this.walletStore.fetchWallets().then(() => this.uiStore.finishRequest());
  }

  render() {
    const asLoading = loadable(this.uiStore.hasPendingRequests);
    return (
      <div className="container">
        <WalletTabs />
        <Route
          exact={true}
          path={`${ROUTE_WALLETS}/:type`}
          component={asLoading(WalletList)}
        />
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
                <CreateWalletForm
                  wallet={this.wallet}
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
