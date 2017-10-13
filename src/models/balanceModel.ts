import {observable} from 'mobx';

export class BalanceModel {
  assetId: string = '';
  @observable balance: number = 0;
  baseCurrency = 'LKK'; // TODO: grab from api

  constructor(json?: any) {
    if (!!json) {
      this.assetId = json.AssetId;
      this.balance = json.Balance;
    }
  }
}
