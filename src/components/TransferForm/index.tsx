import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_WALLET} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {TransferModel} from '../../models';
import {WalletStore} from '../../stores/index';
import {LoadableProps} from '../hoc/loadable';
import './style.css';

type FormEventHandler = React.FormEventHandler<
  HTMLInputElement | HTMLSelectElement
>;

interface TransferFormProps extends LoadableProps, RootStoreProps {
  transfer: TransferModel;
  walletStore: WalletStore;
  onTransfer?: (transfer: TransferModel) => any;
  onSucceeddedTransfer?: (transfer: TransferModel) => any;
  onFailedTransfer?: (transfer: TransferModel, reason: any) => any;
}

export const TransferForm: React.SFC<TransferFormProps> = ({
  transfer,
  walletStore,
  rootStore,
  onTransfer = () => null,
  onSucceeddedTransfer = () => null,
  onFailedTransfer = () => null
}) => {
  const handleChangeAmount: FormEventHandler = e => {
    transfer.update({
      amount: Number(e.currentTarget.value)
    });
  };

  const handleChangeWallet = (side: 'from' | 'to'): FormEventHandler => e => {
    transfer.update({
      [side]: walletStore.findWalletById(e.currentTarget.value)
    });
  };

  const handleChangeAsset: FormEventHandler = e =>
    transfer.update({asset: e.currentTarget.value});

  const handleSubmit: FormEventHandler = async e => {
    e.preventDefault();
    await transfer.submit();
    onTransfer(transfer);
  };

  return (
    <form className="transfer-form">
      <div className="transfer-form__body">
        <div className="transfer-form__group">
          <label className="transfer-form__label">Asset</label>
          <select
            onChange={handleChangeAsset}
            value={transfer.asset}
            className="transfer-form__input"
          >
            {transfer.from.balances.map(b => (
              <option key={b.assetId} value={b.assetId}>
                {b.assetId}
              </option>
            ))}
          </select>
        </div>
        <div className="transfer-form__group">
          <label className="transfer-form__label">From</label>
          <select
            onChange={handleChangeWallet('from')}
            value={transfer.from.id}
            className="transfer-form__input"
          >
            {walletStore.getWalletsWithAssets().map(w => (
              <option key={w.id} value={w.id}>
                {w.title}
              </option>
            ))}
          </select>
        </div>
        <div className="transfer-form__group">
          <label className="transfer-form__label">To</label>
          <select
            onChange={handleChangeWallet('to')}
            className="transfer-form__input"
          >
            {walletStore.getAllWalletsExceptOne(transfer.from).map(w => (
              <option key={w.id} value={w.id}>
                {w.title}
              </option>
            ))}
          </select>
        </div>
        <div className="transfer-form__group">
          <label className="transfer-form__label">Amount</label>
          <input
            type="text"
            onChange={handleChangeAmount}
            className="transfer-form__input"
          />
        </div>
        <div className="transfer-form__group">
          <div className="transfer-form__label">&nbsp;</div>
          <div className="transfer-form__input">
            = {transfer.amountInBaseCurrency} {rootStore!.uiStore.baseCurrency}
          </div>
        </div>
      </div>
      <div className="transfer__actions">
        <div>
          <input type="submit" value="Submit" onClick={handleSubmit} />
        </div>
        <div>
          <Link to={ROUTE_WALLET}>Cancel and go back</Link>
        </div>
      </div>
    </form>
  );
};

export default inject(STORE_ROOT)(observer(TransferForm));
