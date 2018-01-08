import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Route} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {Button} from '../../components/Button';
import Drawer from '../../components/Drawer';
import GenerateWalletKeyForm from '../../components/GenerateWalletKeyForm';
import {IconButton} from '../../components/Icon';
import {ModalDialog} from '../../components/ModalDialog';
import WalletForm, {WalletFormValues} from '../../components/WalletForm';
import WalletList from '../../components/WalletList';
import WalletTabs from '../../components/WalletTabs';
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
              {this.walletStore.selectedWallet.isDeletable && (
                <div className="pull-right">
                  <IconButton
                    size={'16px'}
                    name="recycle"
                    onClick={this.toggleConfirm}
                  >
                    Delete wallet
                  </IconButton>
                </div>
              )}
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
            <ModalDialog
              visible={this.props.rootStore!.uiStore.showConfirmRemoveWallet}
              title="Delete wallet"
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
                  onClick={this.handleRemoveWallet}
                >
                  Yes, delete wallet
                </Button>
              ]}
              style={{margin: '0 auto'}}
            >
              <div className="modal__text">
                <p>Are you sure you want to delete the wallet?</p>
              </div>
            </ModalDialog>
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
    this.walletStore.selectedWallet = null;
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

  private toggleConfirm = () =>
    this.props.rootStore!.uiStore.toggleConfirmRemoveWallet &&
    this.props.rootStore!.uiStore.toggleConfirmRemoveWallet();

  private handleRemoveWallet = async () => {
    this.toggleConfirm();
    const wallet = this.walletStore.selectedWallet;
    if (!wallet) {
      throw new Error('Wallet not selected');
    }
    const apiCall = this.walletStore.removeApiWallet;
    const onSuccess = () => {
      this.props.rootStore!.uiStore.toggleWalletDrawer();
      this.props.rootStore!.walletStore.selectedWallet = null!;
    };
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
