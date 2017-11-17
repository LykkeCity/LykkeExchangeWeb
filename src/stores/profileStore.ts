import {
  action,
  computed,
  extendObservable,
  observable,
  reaction,
  runInAction
} from 'mobx';
import {ProfileApi} from '../api/profileApi';
import {AssetModel} from '../models/index';
import {seq} from '../utils';
import {StorageUtils} from '../utils/index';
import {RootStore} from './index';

const BASE_CURRENCY_STORAGE_KEY = 'lww-base-currency';
const baseCurrencyStorage = StorageUtils.withKey(BASE_CURRENCY_STORAGE_KEY);

export class ProfileStore {
  @observable baseAsset: string = baseCurrencyStorage.get() || 'LKK';

  @computed
  get baseAssetAsModel() {
    return this.rootStore.assetStore.getById(this.baseAsset);
  }

  @observable firstName: string = '';
  @observable lastName: string = '';

  @computed
  get fullName() {
    return `${this.firstName} ${this.lastName || ''}`;
  }

  constructor(private readonly rootStore: RootStore, private api?: ProfileApi) {
    const {walletStore} = this.rootStore;
    reaction(
      () => this.baseAsset,
      baseCurrency => {
        if (!!baseCurrency) {
          walletStore.convertBalances();
          seq(baseCurrencyStorage.set, this.api!.updateBaseAsset)(baseCurrency);
        } else {
          baseCurrencyStorage.clear();
        }
      }
    );
  }

  @action
  setBaseAsset = async (asset: AssetModel) => {
    this.baseAsset = asset.name;
    // this.baseAssetAsModel = asset;
  };

  fetchBaseAsset = async () => {
    const resp = await this.api!.fetchBaseAsset();
    runInAction(() => {
      this.baseAsset = resp.BaseAssetId || this.baseAsset;
    });
  };

  fetchUserInfo = async () => {
    const resp = await this.api!.getUserName();
    if (!!resp) {
      const {FirstName: firstName, LastName: lastName} = resp;
      extendObservable(this, {firstName, lastName});
    }
  };
}

export default ProfileStore;
