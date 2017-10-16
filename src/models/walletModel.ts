import {action, computed, observable} from 'mobx';
import {BalanceModel} from '.';
import {WalletStore} from '../stores';
import {nextId} from '../utils';

export class WalletModel {
  id: string;
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

  @computed
  get totalBalance() {
    const total = new BalanceModel();
    total.assetId = 'LKK'; // TODO: get from the base asset
    total.balance = this.balances.reduce(
      (prev, curr) => (total.balance += curr.balance),
      0
    );

    this.store!
      .convertToBaseCurrency({
        toAssetId: total.assetId,
        // tslint:disable-next-line:object-literal-sort-keys
        fromAssetId: this.balances[0].assetId,
        volume: total.balance,
        direction: 'Buy'
      })
      .then((resp: any) => (total.balance = resp.Result.Converted.To.Amount));
    return total;
  }

  @observable balances: BalanceModel[] = [];

  constructor(json?: any, private store?: WalletStore) {
    this.id = json.Id || nextId();
    this.title = json.Name || 'Untitled';
    this.desc = json.Type;
    this.apiKey = json.ApiKey;
  }

  @action
  setBalances = (dto: any[]) =>
    (this.balances = dto.map(x => new BalanceModel(x)));

  @action toggleCollapse = () => (this.collapsed = !this.collapsed);
}

export default WalletModel;
