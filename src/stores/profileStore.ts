import {
  action,
  computed,
  extendObservable,
  observable,
  reaction,
  runInAction
} from 'mobx';
import {ProfileApi} from '../api/profileApi';
import {StorageUtils} from '../utils/index';
import {RootStore} from './index';

const BASE_CURRENCY_STORAGE_KEY = 'lww-base-currency';
const baseCurrencyStorage = StorageUtils.withKey(BASE_CURRENCY_STORAGE_KEY);

export class ProfileStore {
  @observable knownBaseAssets: string[] = ['LKK', 'USD', 'EUR'];
  @observable baseAsset: string = baseCurrencyStorage.get() || 'LKK';
  @observable firstName: string = '';
  @observable lastName: string = '';

  @computed
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  constructor(private readonly rootStore: RootStore, private api?: ProfileApi) {
    const {walletStore} = this.rootStore;
    reaction(
      () => this.baseAsset,
      baseCurrency => {
        if (!!baseCurrency) {
          walletStore.convertBalances();
          baseCurrencyStorage.set(baseCurrency);
          this.api!.updateBaseAsset(baseCurrency);
        } else {
          baseCurrencyStorage.clear();
        }
      }
    );
  }

  @action
  setBaseAsset = async (asset: string) => {
    this.baseAsset = asset;
  };

  fetchBaseAsset = async () => {
    const resp = await this.api!.fetchBaseAsset();
    runInAction(() => {
      this.baseAsset = resp.BaseAssetId || this.baseAsset;
    });
  };

  fetchFirstName = async () => {
    const {authStore: {getAccessToken}} = this.rootStore!;
    const resp = await this.api!.getUserName(
      getAccessToken(),
      this.rootStore.authStore.redirectToAuthServer
    );
    extendObservable(this, resp);
  };
}

export default ProfileStore;
