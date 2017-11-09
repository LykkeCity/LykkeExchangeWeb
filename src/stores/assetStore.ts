import {observable, runInAction} from 'mobx';
import {AssetApi} from '../api/assetApi';
import {AssetModel} from '../models/index';
import {RootStore} from './index';

export class AssetStore {
  @observable assets: AssetModel[] = [];
  @observable categories: any[] = [];

  constructor(readonly rootStore: RootStore, private api: AssetApi) {}

  getById = (id: string) => this.assets.find(a => a.id === id);

  fetchAssets = async () => {
    await this.fetchCategories();
    const resp = await this.api.fetchAssets();
    runInAction(() => {
      this.assets = resp.Assets.map(
        ({Id: id, DisplayId: name, CategoryId, Accuracy: accuracy}: any) =>
          new AssetModel({
            accuracy,
            category: (this.categories.find(x => x.Id === CategoryId) || {
              Name: 'Uncategorized'
            }).Name,
            id,
            name
          })
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
