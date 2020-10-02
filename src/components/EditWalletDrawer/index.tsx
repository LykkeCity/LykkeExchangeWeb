import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {WalletModel} from '../../models';
import {RootStore} from '../../stores';
import Drawer from '../Drawer';
import EditWalletForm from '../EditWalletForm/index';
import {Wizard, WizardStep} from '../Wizard';

interface EditWalletDrawerProps {
  wallet?: WalletModel;
  overlayed?: boolean;
  show?: boolean;
}

export const EditWalletDrawer: React.SFC<EditWalletDrawerProps> = ({
  wallet = null,
  overlayed = false,
  show = false
}) =>
  wallet && (
    <Drawer title="Edit Wallet" show={show} overlayed={overlayed}>
      <div className="drawer__title">
        <h2>{wallet.title}</h2>
        <h3>
          API Wallet{' '}
          {wallet.apiv2Only && (
            <span className="btn-info badge">Api v2 only</span>
          )}
        </h3>
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

export default inject(({rootStore}: {rootStore: RootStore}) => ({
  overlayed: rootStore.uiStore.drawerOverlayed,
  show: rootStore.uiStore.showEditWalletDrawer,
  wallet: rootStore.walletStore.selectedWallet
}))(observer(EditWalletDrawer));
