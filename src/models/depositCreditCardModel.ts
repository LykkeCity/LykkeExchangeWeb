import {action, computed, observable} from 'mobx';
import {
  ROUTE_DEPOSIT_CREDIT_CARD_FAIL,
  ROUTE_DEPOSIT_CREDIT_CARD_SUCCESS
} from '../constants/routes';
import {AssetModel, WalletModel} from './';

export const DEFAULT_DEPOSIT_OPTION = 'BankCard';

export class DepositCreditCardModel {
  @observable amount: number = 0;
  @observable asset: AssetModel;
  @observable wallet: WalletModel;

  constructor(deposit?: Partial<DepositCreditCardModel>) {
    if (deposit) {
      Object.assign(this, deposit);
    }
  }

  @action
  setAsset = (asset: AssetModel) => {
    this.asset = asset;
  };

  @action
  setWallet = (wallet: WalletModel) => {
    this.wallet = wallet;
  };

  @action
  update = (deposit: Partial<DepositCreditCardModel>) =>
    Object.assign(this, deposit);

  @computed
  get asJson() {
    // when testing locally, hardcode this url instead localhost:
    // http://link4pay-lykke.ngrok.io
    // because above url is whitelisted by payment provider
    const url = `${location.protocol}//${location.host}`;

    return {
      Amount: this.amount,
      AssetId: this.asset && this.asset.id,
      CancelUrl: url,
      FailUrl: url + ROUTE_DEPOSIT_CREDIT_CARD_FAIL,
      OkUrl: url + ROUTE_DEPOSIT_CREDIT_CARD_SUCCESS,
      WalletId: this.wallet && this.wallet.id
    };
  }
}
