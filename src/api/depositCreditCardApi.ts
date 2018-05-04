import {DepositCreditCardModel} from '../models/index';
import {RestApi} from './index';
import {ApiResponse} from './types/index';

export interface DepositCreditCardApi {
  fetchBankCardPaymentUrl: (
    deposit: DepositCreditCardModel
  ) => ApiResponse<any>;
  fetchDepositDefaultValues: () => ApiResponse<any>;
}

export class RestDepositCreditCardApi extends RestApi
  implements DepositCreditCardApi {
  fetchBankCardPaymentUrl = (deposit: DepositCreditCardModel) => {
    return this.apiBearerWretch()
      .url('/BankCardPaymentUrl')
      .json(deposit.asJson)
      .post()
      .unauthorized(this.rootStore.authStore.redirectToAuthServer)
      .json();
  };

  fetchDepositDefaultValues = () => {
    return this.apiBearerWretch()
      .url('/BankCardPaymentUrl')
      .get()
      .unauthorized(this.rootStore.authStore.redirectToAuthServer)
      .json();
  };
}

export default RestDepositCreditCardApi;
