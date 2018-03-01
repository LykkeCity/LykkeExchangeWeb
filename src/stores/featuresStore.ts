import {computed, observable, runInAction} from 'mobx';
import {FeaturesApi} from '../api/featuresApi';
import {FeaturesModel} from '../models/featuresModel';

export class FeatureStore {
  @observable features: FeaturesModel;
  @observable isLoaded: boolean = false;

  constructor(private api: FeaturesApi) {
    this.features = new FeaturesModel();
  }

  getFeatures = async () => {
    const resp = await this.api.getFeatures();
    runInAction(() => {
      this.features.updateFromDto(resp);
      this.isLoaded = true;
    });
  };

  @computed
  get hasAffiliate() {
    return this.features.AffiliateEnabled;
  }
}
