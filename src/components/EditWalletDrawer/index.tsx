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
  onRemoveWallet?: (w: WalletModel) => void;
}

export const EditWalletDrawer: React.SFC<EditWalletDrawerProps> = ({
  wallet = null,
  onRemoveWallet,
  show = false
}) =>
  wallet && (
    <Drawer title="Edit Wallet" show={show}>
      <div className="drawer__title">
        <h2>{wallet.title}</h2>
        <h3>API Wallet</h3>
        <div className="pull-right">
          <Link
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => onRemoveWallet && onRemoveWallet(wallet!)}
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
    </Drawer>
  );

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
    wallet: walletStore.selectedWallet
  })
)(observer(EditWalletDrawer));
