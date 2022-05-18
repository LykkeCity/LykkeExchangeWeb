import {RestApiV1} from './index';
import {ApiResponse} from './types/index';

export interface WithdrawApiV1 {
  fetchSwiftFee: (currency: string, country: string) => ApiResponse<any>;
}

export class RestWithdrawApiV1 extends RestApiV1 implements WithdrawApiV1 {
  fetchSwiftFee = (currency: string, country: string) =>
    this.get(`/offchain/cashout/swift/fee/${currency}/${country}`);
}

export default RestWithdrawApiV1;
