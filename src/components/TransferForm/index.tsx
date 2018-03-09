import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_WALLETS} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {TransferModel, WalletModel} from '../../models';
import {AmountInput} from '../AmountInput';
import {asAssetBalance} from '../hoc/assetBalance';
import Select from '../Select';
import WalletSelect from '../WalletSelect';
import './style.css';

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
    uiStore,
    uiStore: {toggleQrWindow},
    profileStore: {baseAssetAsModel}
  } = rootStore!;

  const handleChangeAmount = (e: any) => {
    transfer.setAmount(e.currentTarget.value);
  };

  const handleChangeWallet = (side: 'from' | 'to') => (option: WalletModel) => {
    if (!option) {
      return;
    }

    const wallet = option as WalletModel;

    if (side === 'from' && wallet.id === transfer.to.id) {
      transfer.to = walletStore.createWallet();
    }
    if (side === 'from') {
      transfer.asset = wallet.balances[0].asset;
    }
    transfer.setWallet(wallet, side);
  };

  const handleChangeAsset = (option: any) => {
    if (!option) {
      return;
    }
    transfer.setAsset(option.asset);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const id = await transfer.sendTransfer();
      if (!!id) {
        toggleQrWindow();
        onTransfer(transfer);
      }
    } catch (error) {
      uiStore.transferError = 'Something went wrong';
      setTimeout(() => {
        uiStore.transferError = '';
      }, 3000);
    }
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
                  balance: x.balance,
                  balanceAvailable: x.availableBalance
                }))}
                // tslint:disable-next-line:jsx-no-lambda
                optionRenderer={(option: any) => (
                  <div className="option">
                    <div>{option.asset.name}</div>
                    <div>
                      <small style={{color: 'gray'}}>
                        {asAssetBalance(option.asset, option.balanceAvailable)}
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
                {AmountInput(
                  handleChangeAmount,
                  transfer.amount,
                  'tr_name',
                  transfer.asset ? transfer.asset.accuracy : 8
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="row">
            <div className="col-sm-8 col-sm-offset-4">
              <div className="text-muted">
                ={' '}
                {!!baseAssetAsModel &&
                  asAssetBalance(
                    baseAssetAsModel,
                    transfer.amountInBaseCurrency
                  )}{' '}
                {!!baseAssetAsModel && baseAssetAsModel.name}
              </div>
            </div>
          </div>
        </div>
        {!!uiStore.transferError && (
          <div style={{color: 'red', textAlign: 'center'}}>
            {uiStore.transferError}
          </div>
        )}
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
