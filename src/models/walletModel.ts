import {action, autorun, computed, observable} from 'mobx';
import {BalanceModel} from '.';
import {WalletStore} from '../stores';
import {nextId} from '../utils';

export class WalletModel {
  @observable id: string = '';
  @observable title: string = '';
  @observable desc: string = '';
  @observable apiKey: string = '';
  @observable baseCurrency = 'LKK';

  @observable balances: BalanceModel[] = [];

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

  @observable collapsed: boolean = true;
  @computed
  get expanded() {
    return !this.collapsed;
  }

  constructor(private store: WalletStore, dto?: any) {
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
    this.title = dto.Name || `Wallet#${this.id}`;
    this.desc =
      dto.Type +
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ';
    this.apiKey = dto.ApiKey;
    if (!!dto.Balances) {
      this.setBalances(dto.Balances);
    }
  };

  @action addToStore = () => this.store.addWallet(this);

  @action
  setBalances = (dto: any[]) => {
    this.balances = dto.map(x => new BalanceModel(x));
  };

  @action debit = (amount: number) => (this.balances[0].balance -= amount);
  @action credit = (amount: number) => (this.balances[0].balance += amount);

  @action toggleCollapse = () => (this.collapsed = !this.collapsed);
}

export default WalletModel;
