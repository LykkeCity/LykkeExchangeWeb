import * as classNames from 'classnames';
import {extendObservable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import GenerateWalletKeyForm from '../../components/GenerateWalletKeyForm';
import {WalletModel} from '../../models/index';
import {RootStore} from '../../stores/index';

import './style.css';

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
  <form className="edit-wallet-form">
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
    <GenerateWalletKeyForm wallet={wallet!} />
    <div className="drawer__footer">
      <button
        className="btn btn--primary pull-right"
        type="button"
        // tslint:disable-next-line:jsx-no-lambda
        onClick={() => onSave && onSave(wallet!)}
        disabled={pending || !wallet!.title}
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
    errors: uiStore.apiError,
    onCancel: async () => {
      const {
        findWalletById,
        fetchWalletById,
        selectedWallet: {id}
      } = walletStore;
      const oldWallet = await fetchWalletById(id);
      extendObservable(findWalletById(id)!, {
        desc: oldWallet.desc,
        title: oldWallet.title
      });
      uiStore.apiError = '';
      walletStore.selectedWallet = null!;
      uiStore.toggleEditWalletDrawer();
    },
    onSave: async (wallet: WalletModel) => {
      try {
        await wallet.save();
        uiStore.toggleEditWalletDrawer();
      } catch (error) {
        uiStore.apiError = error.message;
      }
    },
    pending: walletStore.selectedWallet.updating,
    wallet: walletStore.selectedWallet
  })
)(observer(EditWalletForm));
