import {computed, observable} from 'mobx';
import BalanceStore from '../stores/balanceStore';
import {AssetModel} from './index';

export class BalanceModel {
  assetId: string = '';
  asset: AssetModel;
  @observable balance: number = 0;

  @computed
  get asJson() {
    return {
      Amount: this.balance,
      AssetId: this.assetId
    };
  }

  constructor(
    private readonly store: BalanceStore,
    balance?: Partial<BalanceModel>
  ) {
    Object.assign(this, balance);
  }

  updateFromJson = (dto: any) => {
    if (!!dto) {
      const asset = this.store.rootStore.assetStore.getById(dto.AssetId);
      this.asset = asset!;
      this.assetId = asset!.name;
      this.balance = dto.Balance;
    }
  };
}
