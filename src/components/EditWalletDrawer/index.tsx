import Modal from 'antd/lib/modal/Modal';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {WalletModel} from '../../models';
import {RootStore} from '../../stores';
import Drawer from '../Drawer';
import EditWalletForm from '../EditWalletForm/index';
import {Icon} from '../Icon/index';
import {Link} from '../Link/index';
import {Wizard, WizardStep} from '../Wizard';

interface EditWalletDrawerProps {
  wallet?: WalletModel;
  show?: boolean;
  toggleConfirmRemoveWallet?: () => void;
  showConfirmRemoveWallet?: boolean;
  onRemoveWallet?: (w: WalletModel) => void;
}

export class EditWalletDrawer extends React.Component<EditWalletDrawerProps> {
  render() {
    const {wallet = null, show = false} = this.props;
    return (
      wallet && (
        <Drawer title="Edit Wallet" show={show}>
          <div className="drawer__title">
            <h2>{wallet.title}</h2>
            <h3>API Wallet</h3>
            <div className="pull-right">
              <Link
                // tslint:disable-next-line:jsx-no-lambda
                onClick={this.toggleConfirm}
              >
                <Icon name="recycle" />
                Delete wallet
              </Link>
            </div>
          </div>
          <Wizard activeIndex={1}>
            <WizardStep
              title="Name and description"
              onCancel={null}
              onNext={null}
              index={1}
            >
              <EditWalletForm />
            </WizardStep>
          </Wizard>
          <Modal
            visible={this.props.showConfirmRemoveWallet}
            title="Delete wallet"
            onOk={this.toggleConfirm}
            onCancel={this.toggleConfirm}
            footer={[
              <button
                key="back"
                type="button"
                className="btn btn--primary btn-block"
                onClick={this.toggleConfirm}
              >
                No, back to Wallet
              </button>,
              <button
                key="submit"
                className="btn btn--flat btn-block"
                onClick={this.handleRemoveWallet}
              >
                Yes, delete Wallet
              </button>
            ]}
            style={{margin: '0 auto'}}
          >
            <div className="modal__text">
              <p>Are you sure you want to delete the wallet?</p>
            </div>
          </Modal>
        </Drawer>
      )
    );
  }

  private toggleConfirm = () =>
    this.props.toggleConfirmRemoveWallet &&
    this.props.toggleConfirmRemoveWallet();

  private handleRemoveWallet = () => {
    this.toggleConfirm();
    const {onRemoveWallet, wallet} = this.props;
    if (onRemoveWallet && wallet) {
      onRemoveWallet(wallet!);
    }
  };
}

export default inject(
  ({rootStore: {walletStore, uiStore}}: {rootStore: RootStore}) => ({
    onRemoveWallet: async (wallet: WalletModel) => {
      try {
        await walletStore.removeApiWallet(wallet);
        uiStore.toggleEditWalletDrawer();
      } catch (error) {
        uiStore.apiError = error.message;
      }
    },
    show: uiStore.showEditWalletDrawer,
    showConfirmRemoveWallet: uiStore.showConfirmRemoveWallet,
    toggleConfirmRemoveWallet: uiStore.toggleConfirmRemoveWallet,
    wallet: walletStore.selectedWallet
  })
)(observer(EditWalletDrawer));
