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
  labels?: any;
}

export const EditWalletDrawer: React.SFC<EditWalletDrawerProps> = ({
  wallet = null,
  overlayed = false,
  show = false,
  labels
}) =>
  wallet && (
    <Drawer title={labels.Drawer} show={show} overlayed={overlayed}>
      <div className="drawer__title">
        <h2>{wallet.title}</h2>
        <h3>{labels.APIWallet}</h3>
      </div>
      <Wizard activeIndex={1}>
        <WizardStep
          title={labels.NameStepTitle}
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
  labels: rootStore.localizationStore.i18nEditWalletDrawer,
  overlayed: rootStore.uiStore.drawerOverlayed,
  show: rootStore.uiStore.showEditWalletDrawer,
  wallet: rootStore.walletStore.selectedWallet
}))(observer(EditWalletDrawer));
