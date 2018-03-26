import 'antd/lib/modal/style/css';
import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Route} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import CreateWalletForm from '../../components/CreateWalletForm';
import Drawer from '../../components/Drawer';
import EditWalletDrawer from '../../components/EditWalletDrawer/index';
import GenerateWalletKeyForm from '../../components/GenerateWalletKeyForm';
import WalletList from '../../components/WalletList';
import WalletTabs from '../../components/WalletTabs/index';
import Wizard, {WizardStep} from '../../components/Wizard';
import {ROUTE_WALLETS} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models';

type FormEventHandler<T = HTMLInputElement> = React.FormEventHandler<T>;

export class WalletPage extends React.Component<RootStoreProps> {
  private readonly walletStore = this.props.rootStore!.walletStore;
  private readonly uiStore = this.props.rootStore!.uiStore;
  private readonly transferStore = this.props.rootStore!.transferStore;
  private readonly depositCreditCardStore = this.props.rootStore!
    .depositCreditCardStore;

  @observable private wallet = new WalletModel(this.walletStore);
  @observable private activeStep = 1;

  constructor(props: any) {
    super(props);
    this.transferStore.resetCurrentTransfer();
    this.depositCreditCardStore.resetCurrentDeposit();
  }

  render() {
    return (
      <div className="container">
        <WalletTabs />
        <Route
          exact={true}
          path={`${ROUTE_WALLETS}/:type`}
          component={WalletList}
        />
        <Drawer title="New API Wallet" show={this.uiStore.showWalletDrawer}>
          <div className="drawer__title">
            <h2>New Wallet</h2>
            <h3>API Wallet</h3>
          </div>
          <Wizard activeIndex={this.activeStep}>
            <WizardStep
              title="Name of wallet"
              onCancel={this.uiStore.toggleWalletDrawer}
              onNext={this.handleCreateWallet}
              index={1}
            >
              <CreateWalletForm
                wallet={this.wallet}
                onChangeName={this.handleChangeWalletName}
                onSubmit={this.handleCreateWallet}
                onCancel={this.uiStore.toggleWalletDrawer}
                onChangeDesc={this.handleChangeWalletDesc}
              />
            </WizardStep>
            <WizardStep
              title="Generate API key"
              onCancel={this.uiStore.toggleWalletDrawer}
              onNext={this.handleCreateWallet}
              index={2}
            >
              <GenerateWalletKeyForm wallet={this.wallet} />
              <div className="drawer__footer">
                <button
                  className="btn btn--primary"
                  type="button"
                  onClick={this.uiStore.toggleWalletDrawer}
                >
                  Save
                </button>
              </div>
            </WizardStep>
          </Wizard>
        </Drawer>
        <EditWalletDrawer />
      </div>
    );
  }

  private readonly handleChangeWalletName: FormEventHandler = e => {
    this.wallet.title = e.currentTarget.value;
  };
  private readonly handleChangeWalletDesc: FormEventHandler = e => {
    this.wallet.desc = e.currentTarget.value;
  };

  private readonly handleCreateWallet = async () => {
    this.wallet = await this.walletStore.createApiWallet(this.wallet);
    this.activeStep++;
  };
}

export default inject(STORE_ROOT)(observer(WalletPage));
