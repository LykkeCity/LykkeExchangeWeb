import {observable} from 'mobx';
import {BalanceStore} from '../stores/index';

export class BalanceModel {
  assetId: string = '';
  @observable balance: number = 0;
  baseCurrency = 'LKK'; // TODO: grab from api

  private readonly store: BalanceStore;

  constructor(store: BalanceStore, json?: any) {
    this.store = store;
    if (!!json) {
      this.assetId = json.AssetId;
      this.balance = json.Balance;
    }
  }
}
