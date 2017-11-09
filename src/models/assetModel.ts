export class AssetModel {
  id: string;
  name: string;
  category: string;
  accuracy: number;

  constructor(asset: Partial<AssetModel>) {
    Object.assign(this, asset);
  }
}

export default AssetModel;
