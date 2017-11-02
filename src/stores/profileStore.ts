import {
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
  readonly rootStore: RootStore;

  @observable baseCurrency: string = baseCurrencyStorage.get() || 'LKK';
  @observable firstName: string = '';
  @observable lastName: string = '';

  @computed
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  constructor(rootStore: RootStore, private api?: ProfileApi) {
    this.rootStore = rootStore;

    reaction(
      () => this.baseCurrency,
      baseCurrency => {
        if (!!baseCurrency) {
          baseCurrencyStorage.set(baseCurrency);
          // this.api!.updateBaseCurrency(baseCurrency);
        } else {
          baseCurrencyStorage.clear();
        }
      }
    );
  }

  fetchBaseCurrency = async () => {
    const resp = await this.api!.fetchBaseCurrency();
    runInAction(() => {
      this.baseCurrency = resp.BaseAssetId || this.baseCurrency;
    });
  };

  fetchFirstName = async () => {
    const {authStore: {getAccessToken}} = this.rootStore!;
    const resp = await this.api!.getUserName(getAccessToken());
    extendObservable(this, resp);
  };
}

export default ProfileStore;
