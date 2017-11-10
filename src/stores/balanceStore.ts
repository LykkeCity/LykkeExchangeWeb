import {BalanceModel} from '../models/index';
import {RootStore} from './index';

export class BalanceStore {
  constructor(readonly rootStore: RootStore) {}

  createBalance = (assetId?: string, balance?: number) =>
    new BalanceModel(this, {assetId, balance});

  updateFromServer = (json: any) => {
    const balance = new BalanceModel(this);
    balance.updateFromJson(json);
    return balance;
  };
}

export default BalanceStore;
