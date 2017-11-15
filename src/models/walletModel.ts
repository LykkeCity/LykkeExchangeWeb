import {action, computed, observable, reaction} from 'mobx';
import {AssetModel, BalanceModel, WalletType} from '.';
import {WalletStore} from '../stores';
import {nextId} from '../utils';
import {sum} from '../utils/math';

interface GroupedBalances {
  [key: string]: BalanceModel[];
}

export class WalletModel {
  @observable id = '';
  @observable title = '';
  @observable desc = 'No description';
  @observable apiKey = '';
  @observable type: WalletType;

  @computed
  get totalBalance() {
    return this.balances.map(b => b.balanceInBaseAsset).reduce(sum, 0);
  }

  @observable balances: BalanceModel[] = [];

  @computed
  get getBalancesByCategory() {
    return this.balances.reduce<GroupedBalances>((agg, curr) => {
      const category = curr.asset.category;
      agg[category] = [...(agg[category] || []), curr];
      return agg;
    }, {});
  }

  @observable collapsed = true;
  @observable expanded = !this.collapsed;

  @computed
  get hasBalances() {
    return this.balances && this.balances.length > 0;
  }

  @computed
  get isTrading() {
    return this.type === WalletType.Trading;
  }

  @computed
  get isValid() {
    return !!this.title.trim();
  }

  constructor(private readonly store: WalletStore, dto?: any) {
    this.updateFromJson(dto);
    reaction(
      () => this.collapsed,
      collapsed => {
        this.expanded = !collapsed;
      }
    );
  }

  @action
  updateFromJson = (dto: any) => {
    if (!!dto) {
      this.id = dto.Id || nextId();
      this.type = dto.Type;
      this.title = this.isTrading ? 'Trading Wallet' : dto.Name || this.title;
      this.desc = dto.Description || this.desc;
      this.apiKey = dto.ApiKey;
      if (!!dto.Balances) {
        this.setBalances(dto.Balances);
      }
    }
  };

  @action
  setBalances = (dto: any[]) => {
    const {createBalance} = this.store.rootStore.balanceStore;
    this.balances = dto.map(createBalance);
  };

  @action
  deposit = (balance: number, asset: AssetModel) => {
    const {createBalance} = this.store.rootStore.balanceStore;
    const incomingBalance = createBalance();
    incomingBalance.assetId = asset.id;
    incomingBalance.balance = balance;

    const currBalance = this.balances.find(
      b => b.assetId === incomingBalance.assetId
    );
    if (!!currBalance) {
      currBalance.balance += incomingBalance.balance;
    } else {
      this.balances.push(incomingBalance);
    }
  };
  @action
  withdraw = (amount: number, asset: AssetModel) => {
    const balance = this.balances.find(b => b.assetId === asset.id);
    if (!!balance) {
      balance.balance -= amount;
    }
  };

  @action
  toggleCollapse = () => {
    this.collapsed = !this.collapsed;
    if (!this.collapsed) {
      const restWallets = this.store.getWalletsExceptOne(this);
      restWallets.forEach(w => (w.collapsed = true));
    }
  };
}

export default WalletModel;
