import {Select} from '@lykkex/react-components';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_WALLETS} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {
  BalanceModel,
  TransferModel,
  WalletModel,
  WalletType
} from '../../models';
import {moneyFloor} from '../../utils';
import {AmountInput} from '../AmountInput';
import {asAssetBalance} from '../hoc/assetBalance';

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
    profileStore: {baseAssetAsModel},
    localizationStore
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
      transfer.asset = wallet.balances.sort(
        (a: BalanceModel, b: BalanceModel) =>
          a.asset.name.localeCompare(b.asset.name)
      )[0].asset;
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
      uiStore.transferError = labels.TransferError;
      setTimeout(() => {
        uiStore.transferError = '';
      }, 3000);
    }
  };

  const labels = localizationStore.i18nTransferForm;

  return (
    <form className="transfer-form inline-form">
      <div className="transfer-form__body">
        <div className="form-group">
          <div className="row">
            <div className="col-sm-4">
              <label htmlFor="tr_from" className="control-label">
                {labels.From}
              </label>
            </div>
            <div className="col-sm-8">
              <Select
                optGroups={[
                  {
                    label: labels.TradingWallet,
                    options: walletStore.walletsWithAssets.filter(
                      w => w.type === WalletType.Trading
                    )
                  },
                  {
                    label: labels.APIWallet,
                    options: walletStore.walletsWithAssets.filter(
                      w => w.type === WalletType.Trusted
                    )
                  }
                ]}
                onChange={handleChangeWallet('from')}
                // tslint:disable-next-line:jsx-no-lambda
                optionRenderer={wallet => (
                  <div>
                    <a className="wallet-option">
                      <span className="wallet-option__wallet-name">
                        {wallet.title}
                      </span>
                      <span className="wallet-option__wallet-amount">
                        {!!baseAssetAsModel &&
                          asAssetBalance(
                            baseAssetAsModel,
                            wallet.totalBalance
                          )}{' '}
                        {!!baseAssetAsModel && baseAssetAsModel.name}
                      </span>
                    </a>
                  </div>
                )}
                placeholder={labels.FromPlaceholder}
                searchPlaceholder={labels.FromSearchPlaceholder}
                // tslint:disable-next-line:jsx-no-lambda
                selectRenderer={wallet => {
                  return (
                    wallet && (
                      <div className="wallet-select">
                        <div className="wallet-select__wallet-name">
                          {wallet.title}
                        </div>
                        <div className="wallet-select__wallet-amount">
                          {!!baseAssetAsModel &&
                            asAssetBalance(
                              baseAssetAsModel,
                              wallet.totalBalance
                            )}{' '}
                          {!!baseAssetAsModel && baseAssetAsModel.name}{' '}
                          {labels.Available}
                        </div>
                      </div>
                    )
                  );
                }}
                value={transfer.from && transfer.from.id}
                valueKey="id"
                labelKey="title"
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-sm-4">
              <label htmlFor="tr_asset" className="control-label">
                {labels.Asset}
              </label>
            </div>
            <div className="col-sm-8">
              <Select
                options={transfer.from.balances
                  .map(x => ({
                    asset: x.asset,
                    assetId: x.asset.id,
                    assetName: x.asset.name,
                    balance: x.balance,
                    balanceAvailable: x.availableBalance
                  }))
                  .sort((a: any, b: any) =>
                    a.assetName.localeCompare(b.assetName)
                  )}
                labelKey="assetName"
                valueKey="assetId"
                onChange={handleChangeAsset}
                value={!!transfer.asset && transfer.asset.id}
                // tslint:disable-next-line:jsx-no-lambda
                optionRenderer={option => (
                  <div>
                    <a>
                      <span>{option.assetName}</span>
                      <span className="pull-right">
                        {asAssetBalance(
                          option.asset,
                          option.balanceAvailable
                        )}{' '}
                        {option.assetName}
                      </span>
                    </a>
                  </div>
                )}
                placeholder={labels.AssetPlaceholder}
                searchPlaceholder={labels.AssetSearchPlaceholder}
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-sm-4">
              <label htmlFor="tr_to" className="control-label">
                {labels.To}
              </label>
            </div>
            <div className="col-sm-8">
              <Select
                optGroups={[
                  {
                    label: labels.TradingWallet,
                    options: walletStore
                      .getWalletsExceptOne(transfer.from)
                      .filter(w => w.type === WalletType.Trading)
                  },
                  {
                    label: labels.APIWallet,
                    options: walletStore
                      .getWalletsExceptOne(transfer.from)
                      .filter(w => w.type === WalletType.Trusted)
                  }
                ]}
                onChange={handleChangeWallet('to')}
                // tslint:disable-next-line:jsx-no-lambda
                optionRenderer={wallet => (
                  <div>
                    <a className="wallet-option">
                      <span className="wallet-option__wallet-name">
                        {wallet.title}
                      </span>
                      <span className="wallet-option__wallet-amount">
                        {!!baseAssetAsModel &&
                          asAssetBalance(
                            baseAssetAsModel,
                            wallet.totalBalance
                          )}{' '}
                        {!!baseAssetAsModel && baseAssetAsModel.name}
                      </span>
                    </a>
                  </div>
                )}
                placeholder={labels.ToPlaceholder}
                searchPlaceholder={labels.ToSearchPlaceholder}
                // tslint:disable-next-line:jsx-no-lambda
                selectRenderer={wallet => {
                  return (
                    wallet && (
                      <div className="wallet-select">
                        <div className="wallet-select__wallet-name">
                          {wallet.title}
                        </div>
                        <div className="wallet-select__wallet-amount">
                          {!!baseAssetAsModel &&
                            asAssetBalance(
                              baseAssetAsModel,
                              wallet.totalBalance
                            )}{' '}
                          {!!baseAssetAsModel && baseAssetAsModel.name}{' '}
                          {labels.Available}
                        </div>
                      </div>
                    )
                  );
                }}
                value={transfer.to && transfer.to.id}
                valueKey="id"
                labelKey="title"
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-sm-4">
              <label htmlFor="tr_amount" className="control-label">
                {labels.Amount}
              </label>
            </div>
            <div className="col-sm-8">
              <div className="input-group">
                <div className="input-group-addon addon-text">
                  {transfer.asset && transfer.asset.name}
                </div>
                <AmountInput
                  onChange={handleChangeAmount}
                  name="tr_name"
                  decimalLimit={transfer.asset ? transfer.asset.accuracy : 8}
                />
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
                    moneyFloor(
                      transfer.amountInBaseCurrency,
                      baseAssetAsModel.accuracy
                    )
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
          value={labels.Submit}
          className="btn btn--primary"
          disabled={!transfer.canTransfer}
          onClick={handleSubmit}
        />
        <Link to={ROUTE_WALLETS} className="btn btn--flat">
          {labels.Cancel}
        </Link>
      </div>
    </form>
  );
};

export default inject(STORE_ROOT)(observer(TransferForm));
