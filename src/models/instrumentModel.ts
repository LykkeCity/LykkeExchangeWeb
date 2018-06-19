import {AssetModel} from './index';

export class InstrumentModel {
  id: string;
  name: string;
  baseAsset: AssetModel;
  quoteAsset: AssetModel;
  accuracy: number;
  invertedAccuracy: number;
  bid: number;
  ask: number;

  constructor(asset: Partial<InstrumentModel>) {
    Object.assign(this, asset);
  }
}

export default InstrumentModel;
