import {BalanceModel} from '../models/index';

export class BalanceStore {
  createBalance = (assetId?: string, balance?: number) =>
    new BalanceModel(this, {AssetId: assetId, Balance: balance});

  updateFromServer = (json: any) => new BalanceModel(this, json);
}

export default BalanceStore;
