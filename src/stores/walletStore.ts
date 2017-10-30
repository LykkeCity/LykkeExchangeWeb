import {action, computed, observable, runInAction} from 'mobx';
import {RootStore} from '.';
import {ConverterApi, WalletApi} from '../api';
import {DirectionModel, WalletModel} from '../models';

export class WalletStore {
  readonly rootStore: RootStore;

  @observable wallets: WalletModel[] = [];
  @observable loading: boolean = true;

  @computed
  get totalBalance() {
    return this.wallets.reduce(
      (acc, curr) => (acc += curr.totalBalanceInBaseCurrency.balance),
      0
    );
  }

  constructor(
    rootStore: RootStore,
    private api?: WalletApi,
    private converter?: ConverterApi
  ) {
    this.rootStore = rootStore;
  }

  getWalletsWithAssets = () => {
    return this.wallets.filter(w => w.balances.length > 0);
  };

  getAllWalletsExceptOne = (wallet: WalletModel) =>
    this.wallets.filter(w => w !== wallet);

  createWallet = (dto?: any) => new WalletModel(this, dto);

  fetchWallets = async () => {
    const balances = await this.rootStore.balanceStore.fetchAll();
    runInAction(() => {
      this.wallets = balances.map(this.createWallet);
      this.loading = false;
    });
  };

  fetchWalletById = async (id: string) => {
    const dto = await this.api!.fetchById(id);
    return this.createWallet(dto);
  };

  findWalletById = (id: string) => this.wallets.find(w => w.id === id);

  @action
  addWallet = (wallet: WalletModel) => {
    const idx = this.findWalletById(wallet.id);
    if (!!idx) {
      throw new Error('Duplicate wallet');
    } else {
      this.wallets.unshift(wallet);
    }
  };

  @action
  updateWallet = (wallet: WalletModel) => {
    const idx = this.wallets.findIndex(w => w.id === wallet.id);
    this.wallets.splice(idx, 1, wallet);
  };

  createApiWallet = async (name: string) => {
    const dto = await this.api!.createApiWallet(name);
    const wallet = this.createWallet({...dto, Id: dto.WalletId, Name: name});
    this.addWallet(wallet);
    return wallet;
  };

  regenerateApiKey = async (wallet: WalletModel) => {
    const resp = await this.api!.regenerateApiKey(wallet.id);
    runInAction(() => (wallet.apiKey = resp.ApiKey));
  };

  convertToBaseCurrency = async (wallet: WalletModel) => {
    const resp = await this.converter!.convertToBaseCurrency({
      AssetsFrom: wallet.balances.map(x => ({
        Amount: x.balance,
        AssetId: x.assetId
      })),
      BaseAssetId: wallet.baseCurrency,
      OrderAction: DirectionModel.Buy
    });
    runInAction(() => {
      wallet.totalBalanceInBaseCurrency.balance = resp.Converted.reduce(
        (sum: number, curr: {To: {Amount: number}}) => sum + curr.To.Amount,
        0
      );
    });
  };

  clear = () => (this.wallets = []);
}

export default WalletStore;
