import {action, observable} from 'mobx';
import {RootStore} from '.';
import {DepositCreditCardApi} from '../api/depositCreditCardApi';
import {ApiResponse} from '../api/types';
import {
  convertFieldName,
  DepositCreditCardModel,
  GatewayUrls
} from '../models/index';

export class DepositCreditCardStore {
  @observable defaultDeposit: DepositCreditCardModel;
  @observable newDeposit: DepositCreditCardModel;
  @observable gatewayUrls: GatewayUrls;

  constructor(
    readonly rootStore: RootStore,
    private api?: DepositCreditCardApi
  ) {
    this.defaultDeposit = new DepositCreditCardModel();
    this.newDeposit = new DepositCreditCardModel();
    this.gatewayUrls = new GatewayUrls();
  }

  @action
  resetCurrentDeposit = () => {
    this.newDeposit.update(this.defaultDeposit);
    this.gatewayUrls = new GatewayUrls();
  };

  @action
  setGatewayUrls = (gatewayUrls: GatewayUrls) => {
    this.gatewayUrls = gatewayUrls;
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

    if (response) {
      this.defaultDeposit = new DepositCreditCardModel({
        address: response.Address || '',
        amount: 0,
        city: response.City || '',
        country: response.Country || '',
        depositOption: response.DepositOption || '',
        email: response.Email || '',
        firstName: response.FirstName || '',
        lastName: response.LastName || '',
        phone: response.Phone || '',
        zip: response.Zip || ''
      });
      this.resetCurrentDeposit();
    }
  };
}

export default DepositCreditCardStore;
