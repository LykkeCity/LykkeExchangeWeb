import {action, computed, observable, reaction} from 'mobx';
import {BalanceModel, WalletType} from '.';
import {WalletStore} from '../stores';
import {nextId} from '../utils';

export class WalletModel {
  @observable id = '';
  @observable title = '';
  @observable
  desc = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
  @observable apiKey = '';
  @observable type: WalletType;

  @observable totalBalance: number = 0;

  @observable balances: BalanceModel[] = [];

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
    return !!this.title;
  }

  constructor(
    private readonly store: WalletStore,
    wallet?: Partial<WalletModel>
  ) {
    if (!!wallet) {
      this.id = wallet.id || String(nextId());
      Object.assign(this, wallet);
    }

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
    const {updateFromServer} = this.store.rootStore.balanceStore;
    this.balances = dto.map(updateFromServer);
  };

  @action
  deposit = (balance: number, assetId: string) => {
    const {createBalance} = this.store.rootStore.balanceStore;
    const incomingBalance = createBalance(assetId, balance);

    const currBalance = this.balances.find(
      b => b.assetId === incomingBalance.assetId
    );
    if (!!currBalance) {
      currBalance.balance -= incomingBalance.balance;
    } else {
      this.balances.push(incomingBalance);
    }
  };
  @action
  withdraw = (amount: number, assetId: string) => {
    const balance = this.balances.find(b => b.assetId === assetId);
    if (!!balance) {
      balance.balance += amount;
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
