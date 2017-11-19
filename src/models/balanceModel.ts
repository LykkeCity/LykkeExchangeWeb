import {computed, extendObservable, observable} from 'mobx';
import {BalanceStore} from '../stores/index';
import {AssetModel} from './index';

export class BalanceModel {
  assetId: string = '';
  asset: AssetModel;
  @observable balance: number = 0;

  @computed
  get baseAsset() {
    const {
      profileStore: {baseAsset: baseAssetId},
      assetStore
    } = this.store.rootStore;
    const baseAsset =
      assetStore.getById(baseAssetId) ||
      assetStore.baseAssets.find(x => x.name === baseAssetId); // FIXME: should just lookup by id
    return baseAsset;
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
