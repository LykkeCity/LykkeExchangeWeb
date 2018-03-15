import {AssetCategoryModel} from '.';

export class AssetModel {
  id: string;
  name: string;
  category: AssetCategoryModel;
  description: string;
  accuracy: number;
  iconUrl: string;
  isBankDepositEnabled: boolean;

  isBase: boolean = false;

  constructor(asset?: Partial<AssetModel>) {
    Object.assign(this, asset);
  }
}

export default AssetModel;
