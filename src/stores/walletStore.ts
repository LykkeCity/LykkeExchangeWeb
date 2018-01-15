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
import {WalletModel, WalletType} from '../models';
import {sum} from '../utils/math';

export class WalletStore {
  @observable wallets: WalletModel[] = [];
  @observable selectedWallet: WalletModel | null;

  @computed
  get totalBalance() {
    return this.wallets.map(w => w.totalBalance).reduce(sum, 0);
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

  @computed
  get apiWallets() {
    return this.wallets.filter(
      w => w.type === WalletType.Trusted && !!w.apiKey
    );
  }

  @computed
  get tradingWallets() {
    return this.wallets.filter(w => w.isTrading);
  }

  getWalletsExceptOne = (wallet: WalletModel) =>
    this.wallets.filter(w => w.id !== wallet.id);

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
    this.addWallet(
      extendObservable(newWallet, {title, desc, type: WalletType.Trusted})
    );
    return newWallet;
  };

  findWalletById = (id: string) => this.wallets.find(w => w.id === id);

  clearWallets = () => (this.wallets = []);

  fetchWallets = async () => {
    const wallets = await this.api!.fetchAll();
    const balances = await this.rootStore.balanceStore.fetchAll();
    runInAction(() => {
      this.wallets = wallets.map(this.createWallet);
      this.wallets.forEach(w => {
        w.setBalances(balances.find((b: any) => b.Id === w.id).Balances);
      });
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

  convertBalances = () => {
    const {baseAsset} = this.rootStore.profileStore;
    this.walletsWithAssets.forEach(async wallet => {
      const resp = await this.converter!.convertToBaseAsset(
        wallet.balances.filter(b => b.assetId !== baseAsset),
        baseAsset
      );
      runInAction(() => {
        const convertedAmounts = resp.Converted
          .filter((x: any) => !!x.To && !!x.To.Amount)
          .map((x: any) => ({asset: x.From.AssetId, balance: x.To.Amount}));

        wallet.balances.forEach(b => {
          const convertedAmount = convertedAmounts.find(
            (x: any) => x.asset === b.assetId
          );
          b.balanceInBaseAsset =
            b.assetId === baseAsset
              ? b.balance
              : (convertedAmount && convertedAmount.balance) || 0;
        });
      });
    });
  };

  updateWallet = (wallet: WalletModel) => this.api!.updateWallet(wallet);
}

export default WalletStore;
