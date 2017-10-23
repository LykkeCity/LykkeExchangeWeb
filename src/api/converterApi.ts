import {RestApi} from './index';

export class ConverterApi extends RestApi {
  convertToBaseCurrency = (convertable: any) =>
    this.baseWretch
      .url('/market/converter')
      .json(convertable)
      .post()
      .json();
}

export default ConverterApi;
