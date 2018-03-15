export class AssetModel {
  id: string;
  name: string;
  category: string;
  accuracy: number;
  iconUrl: string;
  isBankDepositEnabled: boolean;

  isBase: boolean = false;

  constructor(asset: Partial<AssetModel>) {
    Object.assign(this, asset);
  }
}

export default AssetModel;
