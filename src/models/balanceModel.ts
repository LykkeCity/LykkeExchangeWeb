import {computed, extendObservable, observable} from 'mobx';
import {BalanceStore} from '../stores/index';

export class BalanceModel {
  assetId: string = '';
  @observable balance: number = 0;

  private readonly store: BalanceStore;

  @computed
  get asJson() {
    return {
      Amount: this.balance,
      AssetId: this.assetId
    };
  }

  constructor(store: BalanceStore, json?: any) {
    this.store = store;
    this.updateFromJson(json);
  }

  private readonly updateFromJson = (dto: any) => {
    if (!!dto) {
      const {AssetId: assetId, Balance: balance} = dto;
      extendObservable(this, {assetId, balance});
    }
  };
}
