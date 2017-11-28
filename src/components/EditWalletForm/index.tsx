import * as classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {WalletModel} from '../../models/index';
import {RootStore} from '../../stores/index';

interface EditWalletFormProps {
  wallet?: WalletModel;
  errors?: any;
  onSave?: (w: WalletModel) => void;
  onCancel?: () => void;
  pending?: boolean;
}

export const EditWalletForm: React.SFC<EditWalletFormProps> = ({
  wallet,
  errors,
  onCancel,
  onSave,
  pending = false
}) => (
  <form>
    <div className="form-group">
      <label htmlFor="name" className="control-label">
        Name of wallet
      </label>
      <input
        type="text"
        name="name"
        id="name"
        className={classNames('form-control', {
          'form-control--error': !!errors
        })}
        required={true}
        value={wallet!.title}
        // tslint:disable-next-line:jsx-no-lambda
        onChange={e => (wallet!.title = e.currentTarget.value)}
        autoFocus={true}
        onBlur={null as any}
      />
      {errors && <div className="label_error">{errors}</div>}
    </div>
    <div className="form-group">
      <label htmlFor="desc" className="control-label">
        Description
      </label>
      <textarea
        id="desc"
        // tslint:disable-next-line:jsx-no-lambda
        onChange={e => (wallet!.desc = e.currentTarget.value)}
        placeholder="Put your description, like My API Wallet"
        className="form-control"
        value={wallet!.desc}
      />
    </div>
    <div className="drawer__footer">
      <button
        className="btn btn--primary pull-right"
        type="button"
        // tslint:disable-next-line:jsx-no-lambda
        onClick={() => onSave && onSave(wallet!)}
        disabled={pending}
      >
        Save change
      </button>
      <button className="btn btn--flat" type="button" onClick={onCancel}>
        Cancel and close
      </button>
    </div>
  </form>
);

export default inject(
  ({rootStore: {walletStore, uiStore}}: {rootStore: RootStore}) => ({
    onCancel: () => {
      walletStore.selectedWallet = null as any;
      uiStore.toggleWalletDrawer();
    },
    onSave: (wallet: WalletModel) => {
      wallet.save().then(() => uiStore.toggleWalletDrawer());
    },
    pending: walletStore.selectedWallet.updating,
    wallet: walletStore.selectedWallet
  })
)(observer(EditWalletForm));
