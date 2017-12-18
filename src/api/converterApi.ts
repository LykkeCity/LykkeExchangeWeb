import {BalanceModel, DirectionModel} from '../models/index';
import {RestApi} from './index';
import {ApiResponse} from './types/index';

export interface ConverterApi {
  convertToBaseAsset: (
    balances: BalanceModel[],
    baseCurrency: string
  ) => ApiResponse<any>;
}

export class RestConverterApi extends RestApi implements ConverterApi {
  convertToBaseAsset = (balances: BalanceModel[], baseCurrency: string) =>
    this.apiWretch
      .url('/market/converter')
      .json({
        AssetsFrom: balances.map(b => b.asJson),
        BaseAssetId: baseCurrency,
        OrderAction: DirectionModel.Sell
      })
      .post()
      .json();
}

export default RestConverterApi;
