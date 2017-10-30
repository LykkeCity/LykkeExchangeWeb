import {observable, reaction, runInAction} from 'mobx';
import {ProfileApi} from '../api/profileApi';
import {RootStore} from './index';

const BASE_CURRENCY_STORAGE_KEY = 'lww-base-currency';
const FIRST_NAME_KEY = 'lww-first-name';
const DEFAULT_FIRST_NAME = 'Noname';

export class ProfileStore {
  readonly rootStore: RootStore;

  @observable baseCurrency: string = 'LKK';
  @observable
  firstName: string = localStorage.getItem(FIRST_NAME_KEY) ||
    DEFAULT_FIRST_NAME;

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

    reaction(
      () => this.firstName,
      firstName => {
        if (firstName) {
          localStorage.setItem(FIRST_NAME_KEY, firstName);
        } else {
          localStorage.removeItem(FIRST_NAME_KEY);
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

    if (authStore.isAuthenticated() && !localStorage.getItem(FIRST_NAME_KEY)) {
      const token = authStore.getAccessToken();
      const resp = await this.api!.getUserName(token);

      runInAction(() => {
        this.firstName = resp.firstName;
      });
    }
  };
}

export default ProfileStore;
