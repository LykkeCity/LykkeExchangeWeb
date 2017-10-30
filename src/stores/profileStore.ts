import {observable, reaction, runInAction} from 'mobx';
import {ProfileApi} from '../api/profileApi';
import {RootStore} from './index';

const BASE_CURRENCY_STORAGE_KEY = 'lww-base-currency';
const DEFAULT_FIRST_NAME = 'Noname';

export class ProfileStore {
  readonly rootStore: RootStore;

  @observable baseCurrency: string = 'LKK';
  @observable firstName: string = DEFAULT_FIRST_NAME;

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

  fetchFirstName = async () => {
    const {authStore} = this.rootStore!;

    if (authStore.isAuthenticated) {
      const token = authStore.getAccessToken();
      const resp = await this.api!.getUserName(token);
      this.firstName = resp.firstName;
    }
  };
}

export default ProfileStore;
