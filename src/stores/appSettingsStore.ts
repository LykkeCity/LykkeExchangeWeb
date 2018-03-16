import {computed, observable, runInAction} from 'mobx';
import {AppSettingsApi} from '../api/appSettingsApi';
import {AppSettingsModel} from '../models';
import {RootStore} from './index';

export class AppSettingsStore {
  @observable appSettings: AppSettingsModel;

  @computed
  get countries() {
    const uniq = (arr: any[]) =>
      arr.filter(
        (obj, index, self) =>
          self.map(mapObj => mapObj.id).indexOf(obj.id) === index
      );

    return uniq(
      this.appSettings.countryCodes.map(cc => ({
        id: cc.Id,
        iso2: cc.Iso2,
        name: cc.Name
      }))
    );
  }

  constructor(readonly rootStore: RootStore, private api?: AppSettingsApi) {
    this.appSettings = new AppSettingsModel();
  }

  fetchSettings = async () => {
    const resp = await this.api!.fetchSettings();

    if (!!resp.Result) {
      // TODO: remove if not needed anymore the defence from Settings error
      const fee = resp.Result.FeeSettings.BankCardsFeeSizePercentage;
      const defaultFee = 0.035;

      runInAction(() => {
        this.appSettings.feeSettings = {
          bankCardsFeeSizePercentage: fee > 1 ? defaultFee : fee
        };
      });
    }
  };

  fetchCountryCodes = async () => {
    const resp = await this.api!.fetchCountryCodes();

    if (!!resp.Result) {
      runInAction(() => {
        this.appSettings.countryCodes = resp.Result.CountriesList;
      });
    }
  };
}

export default AppSettingsStore;
