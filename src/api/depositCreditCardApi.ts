import {DepositCreditCardModel} from '../models/index';
import {RestApiv1} from './index';
import {ApiResponse} from './types/index';

export interface DepositCreditCardApi {
  fetchBankCardPaymentUrl: (
    deposit: DepositCreditCardModel
  ) => ApiResponse<any>;
}

export class RestDepositCreditCardApi extends RestApiv1
  implements DepositCreditCardApi {
  fetchBankCardPaymentUrl = (deposit: DepositCreditCardModel) => {
    return this.apiBearerWretch()
      .url('/BankCardPaymentUrl')
      .json(deposit.asJson)
      .post()
      .unauthorized(this.rootStore.authStore.redirectToAuthServer)
      .json();
  };
}

export default RestDepositCreditCardApi;
