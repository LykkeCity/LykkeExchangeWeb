import {
  action,
  computed,
  extendObservable,
  observable,
  reaction,
  runInAction
} from 'mobx';
import {RootStore} from '.';
import {WalletApi} from '../api';
import {WalletModel, WalletType} from '../models';
import {sum} from '../utils/math';

export class WalletStore {
  @observable wallets: WalletModel[] = [];
  @observable selectedWallet: WalletModel;

  @computed
  get totalBalance() {
    return this.wallets.map(w => w.totalBalance).reduce(sum, 0);
  }

  constructor(readonly rootStore: RootStore, private api?: WalletApi) {
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
    const {baseAssetAsModel} = this.rootStore.profileStore;
    this.walletsWithAssets.forEach(async wallet => {
      runInAction(() => {
        wallet.balances.forEach(b => {
          b.balanceInBaseAsset = this.rootStore.marketService.convert(
            b.balance,
            b.assetId,
            baseAssetAsModel!.id,
            this.rootStore.assetStore.getInstrumentById
          );
        });
      });
    });
  };

  updateWallet = (wallet: WalletModel) => this.api!.updateWallet(wallet);
}

export default WalletStore;
