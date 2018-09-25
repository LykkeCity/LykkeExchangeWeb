import {computed, observable} from 'mobx';
import * as uuid from 'uuid';

export class WithdrawSwiftModel {
  @observable id: string;
  @observable accountName: string;
  @observable accountNumber: string;
  @observable assetId: string;
  @observable amount: number = 0;
  @observable bankName: string;
  @observable bic: string;
  @observable accHolderAddress: string;
  @observable accHolderCity: string;
  @observable accHolderZipCode: string;

  constructor(withdrawSwift?: Partial<WithdrawSwiftModel>) {
    Object.assign(this, withdrawSwift);
    this.id = uuid.v4();
  }

  @computed
  get asJson() {
    return {
      AccHolderAddress: this.accHolderAddress,
      AccHolderCity: this.accHolderCity,
      AccHolderZipCode: this.accHolderZipCode,
      AccName: this.accountName,
      AccNumber: this.accountNumber,
      AssetId: this.assetId,
      BankName: this.bankName,
      Bic: this.bic,
      Volume: this.amount
    };
  }
}

export default WithdrawSwiftModel;
