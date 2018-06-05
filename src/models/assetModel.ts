import {AssetCategoryModel} from '.';

export class AssetModel {
  id: string;
  name: string;
  category: AssetCategoryModel;
  accuracy: number;
  iconUrl: string;

  isBase: boolean = false;

  constructor(asset: Partial<AssetModel>) {
    Object.assign(this, asset);
  }
}

export default AssetModel;
