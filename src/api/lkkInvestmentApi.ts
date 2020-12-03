import {LkkInvestmentModel} from '../models';
import {RestApi} from './index';
import {ApiResponse} from './types/index';

export interface LkkInvestmentApi {
  sendRequest: (model: LkkInvestmentModel) => ApiResponse<any>;
}

export class RestWithdrawApi extends RestApi implements LkkInvestmentApi {
  sendRequest = (model: LkkInvestmentModel) => {
    const data = {
      Amount: model.amount,
      PurchaseOption: model.isBankTransfer ? 'BankTransfer' : 'WalletAccount'
    };

    this.post(`/LkkInvestmentRequest`, data);
  };
}

export default RestWithdrawApi;
