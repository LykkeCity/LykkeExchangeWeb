import {action, computed, observable} from 'mobx';
import {BalanceModel} from '.';
import {nextId} from '../utils/index';

export class WalletModel {
  id: string;
  @observable title: string;
  @observable desc: string;

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
    total.balance = this.balances.reduce(
      (prev, curr) => (total.balance += curr.balance),
      0
    );
    total.assetId = 'LKK'; // FIXME: get from the base asset
    return total;
  }

  @observable balances: BalanceModel[] = [];

  constructor(json?: any) {
    this.id = json.Id || nextId();
    this.title = json.Name || 'Untitled';
    this.desc = json.Type;
  }

  @action
  setBalances = (dto: any[]) =>
    (this.balances = dto.map(x => new BalanceModel(x)));

  @action toggleCollapse = () => (this.collapsed = !this.collapsed);
}

export default WalletModel;
