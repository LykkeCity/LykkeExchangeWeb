import {
  action,
  computed,
  extendObservable,
  observable,
  reaction,
  runInAction
} from 'mobx';
import {RootStore} from '.';
import {ConverterApi, WalletApi} from '../api';
import {WalletModel} from '../models';

export class WalletStore {
  @observable wallets: WalletModel[] = [];

  @computed
  get totalBalance() {
    return this.wallets.reduce(
      (acc, curr) => (acc += curr.totalBalance.balance),
      0
    );
  }

  constructor(
    readonly rootStore: RootStore,
    private api?: WalletApi,
    private converter?: ConverterApi
  ) {
    reaction(
      () =>
        this.wallets.filter(w => w.hasBalances).map(wallet => ({
          wallet,
          // tslint:disable-next-line:object-literal-sort-keys
          balances: wallet.balances
            .filter(b => b.assetId !== this.rootStore.profileStore.baseCurrency)
            .map(b => b.asJson)
        })),
      wallets => {
        wallets.forEach(async ({wallet}) => {
          this.convertToBaseAsset(wallet);
        });
      }
    );
  }

  getWalletsWithAssets = () => {
    return this.wallets.filter(w => w.balances.length > 0);
  };

  getAllWalletsExceptOne = (wallet: WalletModel) =>
    this.wallets.filter(w => w !== wallet);

  createWallet = (dto?: any) => new WalletModel(this, dto);

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
    const newWallet = this.createWallet({
      ApiKey: dto.ApiKey,
      Id: dto.WalletId
    });
    this.addWallet(extendObservable(newWallet, {title, desc}));
    return newWallet;
  };

  findWalletById = (id: string) => this.wallets.find(w => w.id === id);

  clearWallets = () => (this.wallets = []);

  fetchWallets = async () => {
    const balances = await this.rootStore.balanceStore.fetchAll();
    runInAction(() => {
      this.wallets = balances.map(this.createWallet);
    });
  };

  fetchWalletById = async (id: string) => {
    const dto = await this.api!.fetchById(id);
    return this.createWallet(dto);
  };

  regenerateApiKey = async (wallet: WalletModel) => {
    const resp = await this.api!.regenerateApiKey(wallet.id);
    runInAction(() => (wallet.apiKey = resp.ApiKey));
  };

  convertToBaseAsset = async (wallet: WalletModel) => {
    const resp = await this.converter!.convertToBaseAsset(
      wallet.balances,
      this.rootStore.profileStore.baseCurrency
    );
    runInAction(() => {
      wallet.totalBalance.balance = resp.Converted.reduce(
        (agg: number, curr: any) => (agg += curr.To.Amount),
        0
      );
    });
  };
}

export default WalletStore;
