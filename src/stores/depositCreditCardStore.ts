import {action, observable} from 'mobx';
import {RootStore} from '.';
import {DepositCreditCardApi} from '../api/depositCreditCardApi';
import {ApiResponse} from '../api/types';
import {convertFieldName, DepositCreditCardModel} from '../models/index';

export class DepositCreditCardStore {
  @observable defaultDeposit: DepositCreditCardModel;
  @observable newDeposit: DepositCreditCardModel;
  @observable gatewayUrls: {failUrl: string; okUrl: string; paymentUrl: string};

  constructor(
    readonly rootStore: RootStore,
    private api?: DepositCreditCardApi
  ) {
    this.defaultDeposit = new DepositCreditCardModel();
    this.newDeposit = new DepositCreditCardModel();
    this.gatewayUrls = {failUrl: '', okUrl: '', paymentUrl: ''};
  }

  @action
  resetCurrentDeposit = () => {
    this.newDeposit.update(this.defaultDeposit);
    this.gatewayUrls = {failUrl: '', okUrl: '', paymentUrl: ''};
  };

  @action
  setGatewayUrls = (failUrl: string, okUrl: string, paymentUrl: string) => {
    this.gatewayUrls = {failUrl, okUrl, paymentUrl};
  };

  fetchBankCardPaymentUrl = async (deposit: DepositCreditCardModel) => {
    let response: ApiResponse<any>;

    try {
      response = await this.api!.fetchBankCardPaymentUrl(deposit);
    } catch (err) {
      throw {
        message: 'Something went wrong. Please check form or try again later.'
      };
    }

    if (response.Error) {
      throw {
        field: convertFieldName(response.Error.Field),
        message: response.Error.Message
      };
    }

    return {
      failUrl: response.Result.FailUrl,
      okUrl: response.Result.OkUrl,
      paymentUrl: response.Result.Url
    };
  };

  fetchDepositDefaultValues = async () => {
    const response = await this.api!.fetchDepositDefaultValues();

    if (response.Result) {
      this.defaultDeposit = new DepositCreditCardModel({
        address: response.Result.Address || '',
        amount: 0,
        city: response.Result.City || '',
        country: response.Result.Country || '',
        depositOption: response.Result.DepositOption || '',
        email: response.Result.Email || '',
        firstName: response.Result.FirstName || '',
        lastName: response.Result.LastName || '',
        phone: response.Result.Phone || '',
        zip: response.Result.Zip || ''
      });
      this.resetCurrentDeposit();
    }
  };
}

export default DepositCreditCardStore;
