import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link} from 'react-router-dom';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import {RootStoreProps} from '../../App';
import {ROUTE_WALLETS} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {TransferModel, WalletModel} from '../../models';
import {asAssetBalance} from '../hoc/assetBalance';
import {NumberFormat} from '../NumberFormat';
import Select from '../Select';
import WalletSelect from '../WalletSelect';
import './style.css';

// tslint:disable-next-line:no-var-requires
const TextMask = require('react-text-mask').default;

interface TransferFormProps extends RootStoreProps {
  onTransfer?: (transfer: TransferModel) => any;
}

export const AmountInput = (
  transfer: TransferModel,
  handleChangeAmount: (e: any) => void
) => {
  const numberMask = createNumberMask({
    allowDecimal: true,
    allowLeadingZeroes: true,
    decimalLimit: transfer.asset ? transfer.asset.accuracy : 8,
    includeThousandsSeparator: false,
    prefix: '',
    suffix: ''
  });
  return (
    <TextMask
      id="tr_amount"
      mask={numberMask}
      className="form-control"
      value={transfer.amount || ''}
      onChange={handleChangeAmount}
    />
  );
};

export const TransferForm: React.SFC<TransferFormProps> = ({
  rootStore,
  onTransfer = () => null
}) => {
  const {
    transferStore: {newTransfer: transfer},
    walletStore,
    uiStore: {toggleQrWindow}
  } = rootStore!;

  const handleChangeAmount = (e: any) => {
    transfer.setAmount(e.currentTarget.value);
  };

  const handleChangeWallet = (side: 'from' | 'to') => (option: WalletModel) => {
    transfer.setWallet(option as WalletModel, side);
  };

  const handleChangeAsset = (option: any) => transfer.setAsset(option.asset);

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
                options={transfer.from.balances.map(x => ({
                  asset: x.asset,
                  assetId: x.asset.id,
                  assetName: x.asset.name,
                  balance: x.balance
                }))}
                // tslint:disable-next-line:jsx-no-lambda
                optionRenderer={(option: any) => (
                  <div className="option">
                    <div>{option.asset.name}</div>
                    <div>
                      <small style={{color: 'gray'}}>
                        {asAssetBalance(option.asset, option.balance)}
                      </small>
                    </div>
                  </div>
                )}
                labelKey="assetName"
                valueKey="assetId"
                onChange={handleChangeAsset}
                value={!!transfer.asset && transfer.asset.id}
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
                  {transfer.asset && transfer.asset.name}
                </div>
                {AmountInput(transfer, handleChangeAmount)}
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
        <Link to={ROUTE_WALLETS} className="btn btn--flat">
          Cancel and go back
        </Link>
      </div>
    </form>
  );
};

export default inject(STORE_ROOT)(observer(TransferForm));
