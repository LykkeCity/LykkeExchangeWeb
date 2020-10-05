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
  @observable desc = '';
  @observable apiKey = '';
  @observable apiv2Only = true;
  @observable type: WalletType;

  @observable updating: boolean = false;

  @computed
  get totalBalance() {
    return this.balances.map(b => b.balanceInBaseAsset).reduce(sum, 0);
  }

  @observable balances: BalanceModel[] = [];

  @computed
  get getBalancesByCategory() {
    return this.balances
      .sort((b1, b2) => {
        return b1.asset.category.sortOrder - b2.asset.category.sortOrder;
      })
      .reduce<GroupedBalances>((agg, curr) => {
        const category = curr.asset.category.name;
        agg[category] = [...(agg[category] || []), curr];
        return agg;
      }, {});
  }

  @observable collapsed = true;
  @observable expanded = !this.collapsed;
  @observable optionsExanded = false;

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
    this.collapsed = !this.isTrading;
    this.expanded = !this.collapsed;
  }

  @action
  updateFromJson = (dto: any) => {
    if (!!dto) {
      this.id = dto.Id || nextId();
      this.type = dto.Type;
      this.title = this.isTrading ? 'Trading Wallet' : dto.Name || this.title;
      this.desc = dto.Description || this.desc;
      this.apiKey = dto.ApiKey;
      this.apiv2Only = dto.Apiv2Only;
      if (!!dto.Balances) {
        this.setBalances(dto.Balances);
      }
    }
  };

  @action
  setBalances = (dto: any[]) => {
    const {createBalance} = this.store.rootStore.balanceStore;
    this.balances = dto
      .map(createBalance)
      .filter(b => !!b.asset && !!b.asset.id)!;
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
    if (this.isTrading) {
      return;
    }

    this.collapsed = !this.collapsed;
    if (!this.collapsed) {
      const restWallets = this.store.getWalletsExceptOne(this);
      restWallets.forEach(w => (w.collapsed = true));
    }
  };

  save = async () => {
    this.updating = true; // TODO: decorator should be here
    try {
      await this.store.updateWallet(this);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      this.updating = false;
    }
  };

  reset = () => {
    this.title = '';
    this.desc = '';
    this.apiv2Only = true;
    this.optionsExanded = false;
  };
}

export default WalletModel;
