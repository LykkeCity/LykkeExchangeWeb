import {computed, extendObservable, observable} from 'mobx';

export class BalanceModel {
  assetId: string = '';
  @observable balance: number = 0;

  @computed
  get asJson() {
    return {
      Amount: this.balance,
      AssetId: this.assetId
    };
  }

  constructor(balance?: Partial<BalanceModel>) {
    Object.assign(this, balance);
  }

  updateFromJson = (dto: any) => {
    if (!!dto) {
      const {AssetId: assetId, Balance: balance} = dto;
      extendObservable(this, {assetId, balance});
    }
  };
}
