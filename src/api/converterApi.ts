import {BalanceModel, DirectionModel} from '../models/index';
import {RestApi} from './index';

export class ConverterApi extends RestApi {
  convertToBaseAsset = (balances: BalanceModel[], baseCurrency: string) =>
    this.apiWretch
      .url('/market/converter')
      .json({
        AssetsFrom: balances.map(b => b.asJson),
        BaseAssetId: baseCurrency,
        OrderAction: DirectionModel.Buy
      })
      .post()
      .json();
}

export default ConverterApi;
