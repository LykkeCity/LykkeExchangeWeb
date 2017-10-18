import {action, computed, observable, runInAction} from 'mobx';
import {BalanceModel} from '.';
import {WalletStore} from '../stores';
import {nextId} from '../utils';

export class WalletModel {
  @observable id: string;
  @observable title: string;
  @observable desc: string;
  @observable apiKey: string;

  @observable
  figures: {
    total: number;
    sent: number;
    received: number;
    pnl: number;
    assetId: string;
  } = {
    assetId: 'LKK',
    pnl: 0,
    received: 0,
    sent: 0,
    total: 0
  };

  @observable collapsed: boolean = true;

  @computed
  get expanded() {
    return !this.collapsed;
  }

  @observable baseCurrency = 'LKK';

  @computed
  get totalBalance() {
    const total = new BalanceModel();
    total.balance = this.balances.reduce(
      (prev, curr) => (total.balance += curr.balance),
      0
    );
    return total;
  }
  @observable
  totalBalanceInBaseCurrency: BalanceModel = {
    assetId: this.baseCurrency,
    balance: 0,
    baseCurrency: this.baseCurrency
  };

  @observable balances: BalanceModel[] = [];

  constructor(json?: any, private store?: WalletStore) {
    if (!!json) {
      this.id = json.Id || nextId();
      this.title = json.Name || 'Untitled';
      this.desc = json.Type;
      this.apiKey = json.ApiKey;
    }
  }

  @action
  setBalances = (dto: any[]) => {
    this.balances = dto.map(x => new BalanceModel(x));
    this.balances.forEach(async balance => {
      const resp = await this.store!.convertToBaseCurrency({
        amount: balance.balance,
        direction: 'Buy',
        fromAssetId: balance.assetId,
        toAssetId: this.baseCurrency
      });
      runInAction(
        () =>
          (this.totalBalanceInBaseCurrency.balance =
            resp.Result.Converted[0].To.Amount)
      );
    });
  };

  transfer = async (toWallet: WalletModel, amount: number) => {
    await this.store!.transfer(this, toWallet, amount, '');
    runInAction(() => {
      this.balances[0].balance -= amount;
      toWallet.balances[0].balance += amount;
    });
  };

  @action toggleCollapse = () => (this.collapsed = !this.collapsed);
}

export default WalletModel;
