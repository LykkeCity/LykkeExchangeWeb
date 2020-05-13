import {Select} from '@lykkex/react-components';
import * as classnames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_WALLETS_HFT} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {
  BalanceModel,
  TransferModel,
  WalletModel,
  WalletType
} from '../../models';
import {moneyRound} from '../../utils';
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
    transferStore,
    transferStore: {newTransfer: transfer},
    walletStore,
    uiStore,
    uiStore: {toggleQrWindow},
    profileStore,
    profileStore: {baseAssetAsModel}
  } = rootStore!;

  const handleChangeAmount = (e: any) => {
    transfer.setAmount(e.currentTarget.value);
  };

  const handleChange2Fa = (e: any) => {
    transfer.set2Fa(e.currentTarget.value);
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
      transferStore.form.submitting = true;
      const result = await transfer.sendTransfer();
      transferStore.form.submitting = false;
      transferStore.form.is2FaValid = !!result.IsCodeValid;
      if (transferStore.form.is2FaValid) {
        toggleQrWindow();
        onTransfer(transfer);
      } else {
        if (result.Error.Code === 'SecondFactorCheckForbiden') {
          profileStore.tfaStatus = 'forbidden';
          transferStore.form.is2FaValid = true;
          transferStore.form.code2FaError = result.Error.Message;
        } else {
          transferStore.form.code2FaError = result.Error.Message;
        }
      }
    } catch (error) {
      transferStore.form.submitting = false;
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
              <Select
                optGroups={[
                  {
                    label: 'Trading Wallets',
                    options: walletStore.walletsWithAssets.filter(
                      w => w.type === WalletType.Trading
                    )
                  },
                  {
                    label: 'API Wallets',
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
                placeholder="Select..."
                searchPlaceholder="Enter address of wallet or select from list..."
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
                          available
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
                Asset
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
                placeholder="Select..."
                searchPlaceholder="Enter asset name or select from list..."
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
              <Select
                optGroups={[
                  {
                    label: 'Trading Wallets',
                    options: walletStore
                      .getWalletsExceptOne(transfer.from)
                      .filter(w => w.type === WalletType.Trading)
                  },
                  {
                    label: 'API Wallets',
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
                placeholder="Select..."
                searchPlaceholder="Enter address of wallet or select from list..."
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
                          available
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
                Amount
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
                    moneyRound(
                      transfer.amountInBaseCurrency,
                      baseAssetAsModel.accuracy
                    )
                  )}{' '}
                {!!baseAssetAsModel && baseAssetAsModel.name}
              </div>
            </div>
          </div>
        </div>
        <div
          className={classnames('form-group', {
            'has-error': !transferStore.form.is2FaValid
          })}
        >
          <div className="row">
            <div className="col-sm-4">
              <label htmlFor="tr_code2fa" className="control-label">
                2FA code
              </label>
            </div>
            <div className="col-sm-8">
              <div className="error-bar" />
              <input
                type="text"
                id="tr_code2Fa"
                name="code2Fa"
                className="form-control"
                onChange={handleChange2Fa}
              />
              {!transferStore.form.is2FaValid && (
                <span className="help-block">
                  {transferStore.form.code2FaError}
                </span>
              )}
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
          disabled={
            !transfer.canTransfer ||
            !profileStore.is2faEnabled ||
            profileStore.is2faForbidden ||
            transferStore.form.submitting
          }
          onClick={handleSubmit}
        />
        <Link to={ROUTE_WALLETS_HFT} className="btn btn--flat">
          Cancel and go back
        </Link>
      </div>
    </form>
  );
};

export default inject(STORE_ROOT)(observer(TransferForm));
