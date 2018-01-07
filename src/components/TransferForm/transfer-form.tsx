import {Field, Form, Formik, FormikProps} from 'formik';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {ROUTE_WALLETS} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {AssetModel, TransferModel, WalletModel} from '../../models';
import {NumberFormat} from '../NumberFormat';
import WalletOption from './wallet-option';

import Button from '../Button';
import {Select} from '../Select/index';
import {AmountInput} from './amount-input';
import {AssetOption, assetsOptionsMap} from './asset-option';
import './style.css';

interface TransferFormProps extends RootStoreProps {
  onTransfer?: (transfer: TransferModel) => any;
}

interface TransferFormValues {
  amount: number;
  asset: AssetModel;
  from: WalletModel;
  to: WalletModel;
}

type SetFieldValue = (field: string, value: any) => void;

export const TransferForm: React.SFC<TransferFormProps> = ({
  rootStore,
  onTransfer = () => null
}) => {
  const {
    transferStore: {newTransfer: transfer},
    profileStore,
    walletStore,
    uiStore,
    uiStore: {toggleQrWindow},
    profileStore: {baseAssetAsModel}
  } = rootStore!;

  const handleChangeAmount = (setFieldValue: SetFieldValue) => (e: any) => {
    const value: number = e.currentTarget.value;
    transfer.setAmount(value);
    setFieldValue('amount', value);
  };

  const handleChangeWallet = (
    side: 'from' | 'to',
    setFieldValue: SetFieldValue
  ) => (option: WalletModel) => {
    if (!option) {
      return;
    }

    const wallet = option as WalletModel;

    if (side === 'from' && wallet.id === transfer.to.id) {
      transfer.to = walletStore.createWallet();
    }
    transfer.setWallet(wallet, side);
    setFieldValue(side, wallet);
  };

  const handleChangeAsset = (setFieldValue: SetFieldValue) => (option: any) => {
    if (!option) {
      return;
    }
    transfer.setAsset(option.asset);
    setFieldValue('asset', option.asset);
  };

  const handleSubmit = async (values: TransferFormValues) => {
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

  const baseAsset = profileStore.baseAssetAsModel;

  return (
    <Formik
      initialValues={{
        amount: transfer.amount,
        asset: transfer.asset,
        from: transfer.from.id,
        to: transfer.to.id
      }}
      onSubmit={handleSubmit}
      render={({
        values,
        errors,
        touched,
        setFieldValue,
        handleChange,
        isSubmitting
      }: FormikProps<TransferFormValues>) => (
        <Form className="transfer-form inline-form">
          <div className="transfer-form__body">
            <div className="form-group">
              <div className="row">
                <div className="col-sm-4">
                  <label htmlFor="tr_from" className="control-label">
                    From
                  </label>
                </div>
                <div className="col-sm-8">
                  <Field
                    component={Select}
                    name="from"
                    className="form__select"
                    value={!!values.from && values.from.id}
                    onChange={handleChangeWallet('from', setFieldValue)}
                    valueKey="id"
                    labelKey="title"
                    clearable={false}
                    options={walletStore.walletsWithAssets}
                    optionRenderer={
                      baseAsset && WalletOption({currency: baseAsset.name})
                    }
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
                  <Field
                    component={Select}
                    options={transfer.from.balances.map(assetsOptionsMap)}
                    // tslint:disable-next-line:jsx-no-lambda
                    optionRenderer={AssetOption}
                    name="asset"
                    labelKey="assetName"
                    valueKey="assetId"
                    onChange={handleChangeAsset(setFieldValue)}
                    value={!!values.asset && values.asset.id}
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
                  <Field
                    component={Select}
                    name="to"
                    className="form__select"
                    value={!!values.to && values.to.id}
                    onChange={handleChangeWallet('to', setFieldValue)}
                    valueKey="id"
                    labelKey="title"
                    clearable={false}
                    options={walletStore.getWalletsExceptOne(transfer.from)}
                    optionRenderer={
                      baseAsset && WalletOption({currency: baseAsset.name})
                    }
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
                      {values.asset && values.asset.name}
                    </div>
                    {AmountInput(transfer, handleChangeAmount(setFieldValue))}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col-sm-8 col-sm-offset-4">
                  <div className="text-muted">
                    = <NumberFormat
                      value={transfer.amountInBaseCurrency}
                    />{' '}
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
            <Button
              type="submit"
              size="large"
              width={370}
              disabled={!transfer.canTransfer}
            >
              Submit
            </Button>
            <Button to={ROUTE_WALLETS} width={370} size="large" shape="flat">
              Cancel and go back
            </Button>
          </div>
        </Form>
      )}
    />
  );
};

export default inject(STORE_ROOT)(observer(TransferForm));
