import {action, computed, observable, reaction, runInAction} from 'mobx';
import {RootStore} from '.';
import {ConverterApi, WalletApi} from '../api';
import {WalletModel} from '../models';

export class WalletStore {
  @observable wallets: WalletModel[] = [];

  @computed
  get totalBalance() {
    return this.wallets.reduce((acc, curr) => (acc += curr.totalBalance), 0);
  }

  constructor(
    readonly rootStore: RootStore,
    private api?: WalletApi,
    private converter?: ConverterApi
  ) {
    reaction(
      () =>
        this.walletsWithAssets.map(wallet => ({
          balances: wallet.balances.map(b => b.balance),
          wallet
        })),
      () => {
        this.convertBalances();
      }
    );
  }

  @computed
  get walletsWithAssets() {
    return this.wallets.filter(w => w.hasBalances);
  }

  getWalletsExceptOne = (wallet: WalletModel) =>
    this.wallets.filter(w => w !== wallet);

  createWallet = (title?: string) => new WalletModel(this, {Name: title});

  updateFromServer = (json: any) => {
    let wallet = this.findWalletById(json.Id);
    if (!wallet) {
      wallet = new WalletModel(this, json);
      this.addWallet(wallet);
    } else {
      wallet.updateFromJson(json);
    }

    return wallet;
  };

  @action
  addWallet = (wallet: WalletModel) => {
    const idx = this.findWalletById(wallet.id);
    if (!!idx) {
      throw new Error('Duplicate wallet');
    } else {
      this.wallets.unshift(wallet);
    }
  };

  createApiWallet = async (wallet: WalletModel) => {
    const {title, desc} = wallet;
    const dto = await this.api!.createApiWallet(title, desc);
    const newWallet = this.updateFromServer({
      ApiKey: dto.ApiKey,
      Id: dto.WalletId,
      // tslint:disable-next-line:object-literal-sort-keys
      Description: desc,
      Name: title
    });
    return newWallet;
  };

  findWalletById = (id: string) => this.wallets.find(w => w.id === id);

  clearWallets = () => (this.wallets = []);

  fetchWallets = async () => {
    const balances = await this.rootStore.walletBalanceStore.fetchAll();
    runInAction(() => {
      this.wallets = balances.map(this.updateFromServer);
    });
  };

  fetchWalletById = async (id: string) => {
    const dto = await this.api!.fetchById(id);
    return this.updateFromServer(dto);
  };

  regenerateApiKey = async (wallet: WalletModel) => {
    const resp = await this.api!.regenerateApiKey(wallet.id);
    runInAction(() => (wallet.apiKey = resp.ApiKey));
  };

  convertBalances = () =>
    this.walletsWithAssets.forEach(async wallet => {
      const resp = await this.converter!.convertToBaseAsset(
        wallet.balances,
        this.rootStore.profileStore.baseAsset
      );
      runInAction(() => {
        wallet.totalBalance = resp.Converted.reduce(
          (agg: number, curr: any) => (agg += curr.To && curr.To.Amount),
          0
        );
      });
    });
}

export default WalletStore;
