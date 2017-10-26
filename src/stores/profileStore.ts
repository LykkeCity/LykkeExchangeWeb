import {observable, reaction, runInAction} from 'mobx';
import {ProfileApi} from '../api/profileApi';
import {RootStore} from './index';

const BASE_CURRENCY_STORAGE_KEY = 'lww-base-currency';

export class ProfileStore {
  readonly rootStore: RootStore;

  @observable baseCurrency: string = 'LKK';

  constructor(rootStore: RootStore, private api?: ProfileApi) {
    this.rootStore = rootStore;
    reaction(
      () => this.baseCurrency,
      baseCurrency => {
        if (!!baseCurrency) {
          localStorage.setItem(BASE_CURRENCY_STORAGE_KEY, baseCurrency);
          this.api!.updateBaseCurrency(baseCurrency);
        } else {
          localStorage.removeItem(BASE_CURRENCY_STORAGE_KEY);
        }
      }
    );
  }

  fetchBaseCurrency = async () => {
    const resp = await this.api!.fetchBaseCurrency();
    runInAction(() => {
      this.baseCurrency = resp.AssetId; // TODO: grab prop name from dto
    });
  };
}

export default ProfileStore;
