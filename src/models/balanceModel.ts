import {computed, observable} from 'mobx';
import {BalanceStore} from '../stores/index';
import {AssetModel} from './index';

export class BalanceModel {
  assetId: string = '';
  asset: AssetModel;
  @observable balance: number = 0;
  @observable reserved: number = 0;

  @computed
  get availableBalance() {
    return this.balance - this.reserved;
  }

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
  @observable reservedBalanceInBaseAsset: number = 0;

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
  }
}
