import {
  action,
  computed,
  extendObservable,
  observable,
  reaction,
  runInAction
} from 'mobx';
import {ProfileApi} from '../api/profileApi';
import {AssetModel, KycStatuses} from '../models/index';
import {StorageUtils} from '../utils/index';
import {identify} from '../utils/launchDarkly';
import {RootStore} from './index';

const BASE_CURRENCY_STORAGE_KEY = 'lww-base-currency';
const baseCurrencyStorage = StorageUtils.withKey(BASE_CURRENCY_STORAGE_KEY);

export class ProfileStore {
  @observable baseAsset: string = baseCurrencyStorage.get() || 'USD';
  @observable is2faEnabled = false;
  @observable code2fa: string;

  @computed
  get baseAssetAsModel() {
    const {assetStore} = this.rootStore;
    return (
      assetStore.getById(this.baseAsset) ||
      assetStore.baseAssets.find(x => x.name === this.baseAsset) // FIXME: should just lookup by id
    );
  }

  @observable email: string = '';
  @observable isKycPassed: boolean = false;
  @observable firstName: string = '';
  @observable lastName: string = '';

  @computed
  get fullName() {
    return `${this.firstName || ''} ${this.lastName || ''}`;
  }

  constructor(private readonly rootStore: RootStore, private api?: ProfileApi) {
    const {walletStore} = this.rootStore;
    reaction(
      () => this.baseAsset,
      baseAsset => {
        if (!!baseAsset) {
          walletStore.convertBalances();
          baseCurrencyStorage.set(baseAsset);
          this.api!.updateBaseAsset(baseAsset);
        } else {
          baseCurrencyStorage.clear();
        }
      }
    );
  }

  @action
  setBaseAsset = async (asset: AssetModel) => {
    this.baseAsset = asset.id;
  };

  fetchBaseAsset = async () => {
    const resp = await this.api!.fetchBaseAsset();
    runInAction(() => {
      this.baseAsset = resp.BaseAssetId || this.baseAsset;
    });
  };

  fetchUserInfo = async () => {
    const resp = await this.api!.getUserInfo();
    if (!!resp) {
      const {
        Email: email,
        FirstName: firstName,
        KycStatus: kycStatus,
        LastName: lastName
      } = resp;
      identify(process.env.REACT_APP_LAUNCH_DARKLY_CLIENT_ID, {key: email});
      extendObservable(this, {
        email,
        firstName,
        isKycPassed:
          kycStatus === KycStatuses.Ok || kycStatus === KycStatuses.ReviewDone,
        lastName
      });
    }
  };

  fetch2faStatus = async () => {
    const resp = await this.api!.get2faStatus();

    runInAction(() => {
      this.is2faEnabled = resp && resp.length;
    });
  };

  fetch2faCode = async () => {
    const resp = await this.api!.get2faCode();

    runInAction(() => {
      this.code2fa = resp && resp.ManualEntryKey;
    });
  };

  enable2fa = async (code: string) => {
    const resp = await this.api!.enable2fa(code);

    runInAction(() => {
      this.is2faEnabled = resp && resp.IsValid;
    });

    return resp && resp.IsValid;
  };
}

export default ProfileStore;
