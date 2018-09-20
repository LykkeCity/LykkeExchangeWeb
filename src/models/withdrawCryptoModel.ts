import {computed, observable} from 'mobx';
import * as uuid from 'uuid';

export class WithdrawCryptoModel {
  @observable id: string;
  @observable baseAddress: string;
  @observable addressExtension: string;
  @observable assetId: string;
  @observable amount: number = 0;
  @observable balance: number = 0;
  @observable fee: number = 0;
  @observable isExtensionMandatory: boolean = false;

  constructor(withdrawCrypto?: Partial<WithdrawCryptoModel>) {
    Object.assign(this, withdrawCrypto);
    this.id = uuid.v4();
  }

  @computed
  get asJson() {
    return {
      AssetId: this.assetId,
      DestinationAddress: this.baseAddress,
      DestinationAddressExtension: this.addressExtension,
      Volume: this.amount
    };
  }
}

export default WithdrawCryptoModel;
