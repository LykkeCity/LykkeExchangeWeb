import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_WALLET} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {TransferModel, WalletModel} from '../../models';
import {NumberFormat} from '../NumberFormat';
import Select, {SelectOption} from '../Select';
import WalletSelect from '../WalletSelect';
import './style.css';

type InputEventHandler = React.FormEventHandler<HTMLInputElement>;
type SelectEventHandler = (e: WalletModel | SelectOption) => void;

interface TransferFormProps extends RootStoreProps {
  onTransfer?: (transfer: TransferModel) => any;
}

export const TransferForm: React.SFC<TransferFormProps> = ({
  rootStore,
  onTransfer = () => null
}) => {
  const {
    transferStore: {newTransfer: transfer},
    walletStore,
    uiStore: {toggleQrWindow}
  } = rootStore!;

  const handleChangeAmount: InputEventHandler = e => {
    transfer.setAmount(Number(e.currentTarget.value));
  };

  const handleChangeWallet = (
    side: 'from' | 'to'
  ): SelectEventHandler => option => {
    transfer.setWallet(option as WalletModel, side);
  };

  const handleChangeAsset = (option: any) => transfer.setAsset(option.assetId);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    toggleQrWindow();
    await transfer.sendTransfer();
    onTransfer(transfer);
  };

  return (
    <form className="transfer-form inline-form">
      <div className="transfer-form__body">
        <div className="form-group">
          <div className="row">
            <div className="col-sm-4">
              <label htmlFor="tr_from" className="control-label">
                From
              </label>
            </div>
            <div className="col-sm-8">
              <WalletSelect
                options={walletStore.walletsWithAssets}
                onChange={handleChangeWallet('from')}
                value={transfer.from && transfer.from.id}
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-sm-4">
              <label htmlFor="tr_asset" className="control-label">
                Asset
              </label>
            </div>
            <div className="col-sm-8">
              <Select
                options={transfer.from.balances.map(x => x)}
                valueKey="assetId"
                labelKey="assetId"
                onChange={handleChangeAsset}
                value={transfer.asset}
                clearable={false}
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-sm-4">
              <label htmlFor="tr_to" className="control-label">
                To
              </label>
            </div>
            <div className="col-sm-8">
              <WalletSelect
                options={walletStore.getWalletsExceptOne(transfer.from)}
                onChange={handleChangeWallet('to')}
                value={transfer.to && transfer.to.id}
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-sm-4">
              <label htmlFor="tr_amount" className="control-label">
                Amount
              </label>
            </div>
            <div className="col-sm-8">
              <div className="input-group">
                <div className="input-group-addon addon-text">
                  {transfer.asset}
                </div>
                <input
                  id="tr_amount"
                  type="text"
                  className="form-control"
                  value={transfer.amount}
                  onChange={handleChangeAmount}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="row">
            <div className="col-sm-8 col-sm-offset-4">
              <div className="text-muted">
                = <NumberFormat value={transfer.amountInBaseCurrency} />{' '}
                {rootStore!.profileStore.baseAsset}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="transfer__actions">
        <input
          type="submit"
          value="Submit"
          className="btn btn--primary"
          disabled={!transfer.canTransfer}
          onClick={handleSubmit}
        />
        <Link to={ROUTE_WALLET} className="btn btn--flat">
          Cancel and go back
        </Link>
      </div>
    </form>
  );
};

export default inject(STORE_ROOT)(observer(TransferForm));
