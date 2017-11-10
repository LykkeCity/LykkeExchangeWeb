import {BalanceModel} from '../models/index';

export class BalanceStore {
  createBalance = (assetId?: string, balance?: number) =>
    new BalanceModel({assetId, balance});

  updateFromServer = (json: any) => {
    const balance = new BalanceModel();
    balance.updateFromJson(json);
    return balance;
  };
}

export default BalanceStore;
