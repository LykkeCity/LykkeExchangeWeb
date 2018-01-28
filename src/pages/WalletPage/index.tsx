import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Route} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {Button} from '../../components/Button';
import Drawer from '../../components/Drawer';
import GenerateWalletKeyForm from '../../components/GenerateWalletKeyForm';
import WalletForm, {WalletFormValues} from '../../components/WalletForm';
import WalletList from '../../components/WalletList';
import WalletTabs from '../../components/WalletTabs/index';
import Wizard, {WizardStep} from '../../components/Wizard';
import {ROUTE_WALLETS} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models';

interface WalletApiCall {
  wallet: WalletModel;
  apiCall: (w: WalletModel) => Promise<any>;
  onSuccess: (w: WalletModel) => void;
}

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

  render() {
    return (
      <div className="container">
        <WalletTabs />
        <Route
          exact={true}
          path={`${ROUTE_WALLETS}/:type`}
          component={WalletList}
        />
        {!!this.walletStore.selectedWallet ? (
          <Drawer title="Edit Wallet" show={this.uiStore.showWalletDrawer}>
            <div className="drawer__title">
              <h2>{this.walletStore.selectedWallet.title}</h2>
              <h3>API Wallet</h3>
            </div>
            <Wizard activeIndex={1}>
              <WizardStep
                title="Name and description"
                onCancel={null}
                onNext={null}
                index={1}
              >
                <WalletForm
                  wallet={this.walletStore.selectedWallet}
                  submitLabel="Save change"
                  onSubmit={this.handleSave}
                  onCancel={this.handleCancel}
                />
              </WizardStep>
            </Wizard>
          </Drawer>
        ) : (
          <Drawer title="New API Wallet" show={this.uiStore.showWalletDrawer}>
            <div className="drawer__title">
              <h2>New Wallet</h2>
              <h3>API Wallet</h3>
            </div>
            <Wizard activeIndex={this.activeStep}>
              <WizardStep
                title="Name of wallet"
                onCancel={this.handleCancel}
                onNext={this.handleCreate}
                index={1}
              >
                <WalletForm
                  wallet={this.wallet}
                  submitLabel="Generate API Key"
                  onSubmit={this.handleCreate}
                  onCancel={this.handleCancel}
                />
              </WizardStep>
              <WizardStep
                title="Generate API key"
                onCancel={this.handleCancel}
                onNext={this.handleCreate}
                index={2}
              >
                <GenerateWalletKeyForm wallet={this.wallet} />
                <div className="drawer__footer">
                  <Button
                    width={189}
                    size="large"
                    type="button"
                    onClick={this.uiStore.toggleWalletDrawer}
                  >
                    Save
                  </Button>
                </div>
              </WizardStep>
            </Wizard>
          </Drawer>
        )}
      </div>
    );
  }

  private readonly handleCancel = () => {
    this.uiStore.toggleWalletDrawer();
    this.walletStore.deselectWallet();
  };

  private readonly handleCreate = async ({title, desc}: WalletFormValues) => {
    const wallet = this.wallet;
    wallet.title = title;
    wallet.desc = desc;
    const apiCall = this.walletStore.createApiWallet;
    const onSuccess = (updatedWallet: WalletModel) => {
      this.wallet = updatedWallet;
      this.activeStep++;
    };
    await this.walletApiCall({wallet, apiCall, onSuccess});
  };

  private readonly handleSave = async ({title, desc}: WalletFormValues) => {
    const wallet = this.walletStore.selectedWallet;
    if (!wallet) {
      throw new Error('Wallet is not selected');
    }
    wallet.title = title;
    wallet.desc = desc;
    const apiCall = wallet.save;
    const onSuccess = this.handleCancel;
    await this.walletApiCall({wallet, apiCall, onSuccess});
  };

  private readonly walletApiCall = async ({
    wallet,
    apiCall,
    onSuccess
  }: WalletApiCall) => {
    this.uiStore.apiError = '';
    try {
      const updatedWallet = await apiCall(wallet);
      onSuccess(updatedWallet);
    } catch (error) {
      this.uiStore.apiError = error.message;
    }
  };
}

export default inject(STORE_ROOT)(observer(WalletPage));
