import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {InjectedRootStoreProps} from '../../App';
import {ROUTE_WALLET} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {TransferModel} from '../../models';
import {WalletStore} from '../../stores/index';
import {LoadableProps} from '../hoc/loadable';
import './style.css';

type FormEventHandler = React.FormEventHandler<
  HTMLInputElement | HTMLSelectElement
>;

interface TransferFormProps extends LoadableProps, InjectedRootStoreProps {
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
    <form className="transfer__form">
      <div>
        <label>Asset</label>
        <select onChange={handleChangeAsset} value={transfer.asset}>
          {transfer.from.balances.map(b => (
            <option key={b.assetId} value={b.assetId}>
              {b.assetId}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>From</label>
        <select onChange={handleChangeWallet('from')} value={transfer.from.id}>
          {walletStore.getWalletsWithAssets().map(w => (
            <option key={w.id} value={w.id}>
              {w.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>To</label>
        <select onChange={handleChangeWallet('to')}>
          {walletStore.getAllWalletsExceptOne(transfer.from).map(w => (
            <option key={w.id} value={w.id}>
              {w.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Amount</label>
        <input type="text" onChange={handleChangeAmount} />
      </div>
      <div>
        <div>&nbsp;</div>
        <div>
          {transfer.amountInBaseCurrency} {rootStore!.uiStore.baseCurrency}
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
