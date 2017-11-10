import {computed, extendObservable, observable} from 'mobx';
import {BalanceStore} from '../stores/index';
import {AssetModel} from './index';

export class BalanceModel {
  assetId: string = '';
  asset: AssetModel;
  @observable balance: number = 0;

  @computed
  get baseAsset() {
    const {profileStore: {baseAsset}, assetStore} = this.store.rootStore;
    return assetStore.getById(baseAsset);
  }
  @observable balanceInBaseAsset: number = 0;

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
