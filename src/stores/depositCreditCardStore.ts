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
      if (err.message) {
        const errors = JSON.parse(err.message);
        const invalidFieldsNames = Object.keys(errors);
        invalidFieldsNames.forEach(fieldName => {
          throw {
            field: convertFieldName(fieldName),
            message: errors[fieldName]
          };
        });
      }
      throw {
        message: 'Something went wrong. Please check form or try again later.'
      };
    }

    return {
      failUrl: response.FailUrl,
      okUrl: response.OkUrl,
      paymentUrl: response.Url
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
