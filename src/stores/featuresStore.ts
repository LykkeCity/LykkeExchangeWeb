import {computed, observable, runInAction} from 'mobx';
import {FeaturesApi} from '../api/featuresApi';
import {FeaturesModel} from '../models/featuresModel';

export class FeaturesStore {
  @observable featuresModel: FeaturesModel;
  @observable isLoaded: boolean = false;

  constructor(private api: FeaturesApi) {
    this.featuresModel = new FeaturesModel();
  }

  getFeatures = async () => {
    const resp = await this.api.getFeatures();
    runInAction(() => {
      this.featuresModel.updateFromDto(resp);
      this.isLoaded = true;
    });
  };

  @computed
  get hasAffiliate() {
    return this.featuresModel.AffiliateEnabled;
  }
}
