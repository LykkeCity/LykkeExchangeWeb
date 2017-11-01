import {action, autorun, computed, observable} from 'mobx';
import {BalanceModel, WalletType} from '.';
import {WalletStore} from '../stores';
import {nextId} from '../utils';

export class WalletModel {
  @observable id: string = '';
  @observable title: string = 'Untitled';
  @observable
  desc: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
  @observable apiKey: string = '';
  @observable baseCurrency = 'LKK';
  @observable type: WalletType;

  @observable balances: BalanceModel[] = [];

  @computed
  get hasBalances() {
    return this.balances && this.balances.length > 0;
  }

  @computed
  get isTrading() {
    return this.type === WalletType.Trading;
  }

  @computed
  get totalBalance() {
    const total = this.balanceStore.createBalance();
    total.balance = this.balances.reduce(
      (prev, curr) => (total.balance += curr.balance),
      0
    );
    return total;
  }

  @observable totalBalanceInBaseCurrency: BalanceModel;

  @observable collapsed: boolean = true;
  @computed
  get expanded() {
    return !this.collapsed;
  }

  private balanceStore = this.store.rootStore.balanceStore;

  constructor(private store: WalletStore, dto?: any) {
    this.totalBalanceInBaseCurrency = this.balanceStore.createBalance();
    if (!!dto) {
      this.mapFromJson(dto);
    }

    autorun(() => {
      if (this.balances.length > 0) {
        this.store!.convertToBaseCurrency(this);
      }
    });
  }

  mapFromJson = (dto: any) => {
    this.id = dto.Id || nextId();
    this.title = dto.Name || this.title;
    this.desc = dto.Description || this.desc;
    this.apiKey = dto.ApiKey;
    this.type = dto.Type;
    if (!!dto.Balances) {
      this.setBalances(dto.Balances);
    }
  };

  @action
  setBalances = (dto: any[]) => {
    this.balances = dto.map(this.balanceStore.createBalance);
  };

  @action debit = (amount: number) => (this.balances[0].balance -= amount);
  @action credit = (amount: number) => (this.balances[0].balance += amount);

  @action toggleCollapse = () => (this.collapsed = !this.collapsed);
}

export default WalletModel;
