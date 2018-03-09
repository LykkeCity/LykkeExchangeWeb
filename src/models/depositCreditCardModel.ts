import {action, computed, observable} from 'mobx';
import {AssetModel, WalletModel} from './';

export class DepositCreditCardModel {
  @observable address: string = '';
  @observable amount: number = 0;
  @observable asset: AssetModel;
  @observable city: string = '';
  @observable country: string = '';
  @observable email: string = '';
  @observable firstName: string = '';
  @observable lastName: string = '';
  @observable phone: string = '';
  @observable wallet: WalletModel;
  @observable zip: string = '';

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
    return {
      Address: this.address,
      Amount: this.amount,
      AssetId: this.asset && this.asset.id,
      City: this.city,
      Country: this.country,
      DepositOption: 'BankCard',
      Email: this.email,
      FirstName: this.firstName,
      LastName: this.lastName,
      Phone: this.phone,
      WalletId: this.wallet && this.wallet.id,
      Zip: this.zip
    };
  }
}

export const convertFieldName = (apiFieldName: string) =>
  ({
    Address: 'address',
    Amount: 'amount',
    AssetId: 'assetId',
    City: 'city',
    Country: 'country',
    Email: 'email',
    FirstName: 'firstName',
    LastName: 'lastName',
    Phone: 'phone',
    WalletId: 'walletId',
    Zip: 'zip'
  }[apiFieldName]);
