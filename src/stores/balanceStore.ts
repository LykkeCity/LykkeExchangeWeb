import {observable, runInAction} from 'mobx';
import {RootStore} from '.';
import {BalanceApi} from '../api/';
import {BalanceModel, WalletModel} from '../models/index';

export class BalanceStore {
  readonly rootStore: RootStore;

  @observable balances: any[];

  constructor(rootStore: RootStore, private api?: BalanceApi) {
    this.rootStore = rootStore;
  }

  createBalance = (dto?: any) => {
    const balance = new BalanceModel(this);
    if (!!dto) {
      const asset = this.rootStore.assetStore.getById(dto.AssetId);
      if (asset) {
        balance.asset = asset!;
        balance.assetId = asset!.id;
      } else {
        // tslint:disable-next-line:no-console
        console.warn(
          '[LW] Cannot find an asset in reference data',
          dto.AssetId
        );
      }
      balance.balance = Number(dto.Balance);
      balance.reserved = Number(dto.Reserved || 0);
    }
    return balance;
  };

  subscribe = () => {
    const BALANCES_TOPIC = 'balances';
    this.rootStore.socketStore.subscribe(BALANCES_TOPIC, this.onUpdateBalance);
  };

  onUpdateBalance = async (args: any) => {
    const dto = args[0];
    const {id, a, b, r} = dto;
    const wallet = this.rootStore.walletStore.findWalletById(id);
    const balance =
      wallet &&
      wallet.balances.find(walletBalance => walletBalance.assetId === a);
    if (balance) {
      balance.reserved = r;
      balance.balance = b;
    }
  };

  fetchAll = async () => await this.api!.fetchAll();

  fetchById = async (assetId: string) => {
    const balance = await this.api!.fetchById(assetId);
    runInAction(() => {
      const idx = this.balances.findIndex(x => x.id === balance);
      this.balances[idx] = balance;
    });
  };

  fetchForWallet = async (wallet: WalletModel) => {
    const balances = (await this.api!.fetchForWallet(wallet.id)) as any[];
    runInAction(() => {
      wallet.setBalances(balances);
    });
  };
}

export default BalanceStore;
