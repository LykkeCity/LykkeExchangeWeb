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
import {RootStore} from './index';

const BASE_CURRENCY_STORAGE_KEY = 'lww-base-currency';
const baseCurrencyStorage = StorageUtils.withKey(BASE_CURRENCY_STORAGE_KEY);

const TfaStatus = {
  Active: 'active',
  Disabled: '',
  Forbidden: 'forbidden'
};

export class ProfileStore {
  @observable baseAsset: string = baseCurrencyStorage.get() || 'USD';
  @observable tfaStatus: string = '';
  @observable code2fa: string;

  @computed
  get is2faEnabled() {
    return this.tfaStatus !== TfaStatus.Disabled;
  }

  @computed
  get is2faForbidden() {
    return this.tfaStatus === TfaStatus.Forbidden;
  }

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
      extendObservable(this, {
        email,
        firstName,
        isKycPassed: kycStatus === KycStatuses.Ok,
        lastName
      });
    }
  };

  fetch2faStatus = async () => {
    const resp = await this.api!.get2faStatus();

    runInAction(() => {
      if (resp && resp.length) {
        this.tfaStatus = resp[0].Status;
      }
    });
  };

  fetch2faCode = async () => {
    const resp = await this.api!.get2faCode();

    runInAction(() => {
      this.code2fa = resp && resp.ManualEntryKey;
    });
  };

  sendSmsCode = () => {
    return this.api!.sendSmsCode();
  };

  enable2fa = async (tfaCode: string, smsCode: string) => {
    try {
      const resp = await this.api!.verifySmsCode(tfaCode, smsCode);

      runInAction(() => {
        if (resp && resp.IsValid) {
          this.tfaStatus = TfaStatus.Active;
        }
      });

      return resp && resp.IsValid;
    } catch (e) {
      this.tfaStatus = TfaStatus.Forbidden;
    }
  };
}

export default ProfileStore;
