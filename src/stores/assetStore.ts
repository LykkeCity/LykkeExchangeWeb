import {computed, observable, runInAction} from 'mobx';
import {AssetApi} from '../api/assetApi';
import {AssetModel} from '../models/index';
import {RootStore} from './index';

export class AssetStore {
  @observable assets: AssetModel[] = [];
  @computed
  get baseAssets() {
    return this.assets.filter(x => x.isBase);
  }
  @observable categories: any[] = [];

  constructor(readonly rootStore: RootStore, private api: AssetApi) {}

  getById = (id: string) => this.assets.find(a => a.id === id);

  fetchAssets = async () => {
    await this.fetchCategories();
    const resp = await this.api.fetchAssets();
    runInAction(() => {
      this.assets = resp.Assets.map(
        ({
          Id: id,
          DisplayId: name,
          CategoryId,
          Accuracy: accuracy,
          IsBase
        }: any) => {
          const category = this.categories.find(x => x.Id === CategoryId) || {
            Name: 'Other'
          };
          const asset = new AssetModel({
            accuracy,
            category: category.Name,
            id,
            name
          });
          asset.isBase = IsBase;
          return asset;
        }
      );
    });
  };

  fetchCategories = async () => {
    const resp = await this.api.fetchCategories();
    runInAction(() => {
      this.categories = resp.AssetCategories;
    });
  };
}
