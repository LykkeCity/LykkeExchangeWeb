import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_WALLET} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {TransferModel, WalletModel} from '../../models';
import FormGroup from '../FormGroup';
import FormInput from '../FormInput';
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
    await transfer.submit();
    onTransfer(transfer);
  };

  return (
    <form className="transfer-form">
      <div className="transfer-form__body">
        <FormGroup label="From">
          <WalletSelect
            options={walletStore.walletsWithAssets}
            onChange={handleChangeWallet('from')}
            value={transfer.from && transfer.from.id}
          />
        </FormGroup>
        <FormGroup label="Asset">
          <Select
            options={transfer.from.balances.map(x => x)}
            valueKey="assetId"
            labelKey="assetId"
            onChange={handleChangeAsset}
            value={transfer.asset}
            clearable={false}
          />
        </FormGroup>
        <FormGroup label="To">
          <WalletSelect
            options={walletStore.getWalletsExceptOne(transfer.from)}
            onChange={handleChangeWallet('to')}
            value={transfer.to && transfer.to.id}
          />
        </FormGroup>
        <FormGroup label="Amount">
          <FormInput
            type="text"
            onChange={handleChangeAmount}
            value={transfer.amount}
          />
        </FormGroup>
        <FormGroup label="">
          <div className="form__input">
            = <NumberFormat value={transfer.amountInBaseCurrency} />{' '}
            {rootStore!.profileStore.baseAsset}
          </div>
        </FormGroup>
      </div>
      <div className="transfer__actions">
        <div>
          <input
            type="submit"
            value="Submit"
            disabled={!transfer.canTransfer}
            onClick={handleSubmit}
          />
        </div>
        <div>
          <Link to={ROUTE_WALLET}>Cancel and go back</Link>
        </div>
      </div>
    </form>
  );
};

export default inject(STORE_ROOT)(observer(TransferForm));
