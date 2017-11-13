import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link} from 'react-router-dom';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import {RootStoreProps} from '../../App';
import {ROUTE_WALLETS} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {BalanceModel, TransferModel, WalletModel} from '../../models';
import {debounce} from '../../utils/debounce';
import {asBalance} from '../hoc/assetBalance';
import {NumberFormat} from '../NumberFormat';
import Select from '../Select';
import WalletSelect from '../WalletSelect';
import './style.css';

// tslint:disable-next-line:no-var-requires
const TextMask = require('react-text-mask').default;
const numberMask = createNumberMask({
  allowDecimal: true,
  decimalLimit: 8,
  includeThousandsSeparator: false,
  prefix: '',
  suffix: ''
});

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

  const handleChangeAmount = (e: any) => {
    debounce((v: number) => transfer.setAmount(v), 300)(e.currentTarget.value);
  };

  const handleChangeWallet = (side: 'from' | 'to') => (option: WalletModel) => {
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
                // tslint:disable-next-line:jsx-no-lambda
                optionRenderer={(balance: BalanceModel) => (
                  <div className="option">
                    <div>{balance.assetId}</div>
                    <div>
                      <small style={{color: 'gray'}}>
                        {asBalance(balance)}
                      </small>
                    </div>
                  </div>
                )}
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
                <TextMask
                  id="tr_amount"
                  mask={numberMask}
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
        <Link to={ROUTE_WALLETS} className="btn btn--flat">
          Cancel and go back
        </Link>
      </div>
    </form>
  );
};

export default inject(STORE_ROOT)(observer(TransferForm));
