import {action, observable, runInAction} from 'mobx';
import {RootStore} from '.';
import {DepositApi} from '../api/depositApi';
import {ApiResponse} from '../api/types';
import {
  convertFieldName,
  DepositCreditCardModel,
  DepositSwiftModel,
  GatewayUrls
} from '../models/index';

export class DepositStore {
  @observable defaultDeposit: DepositCreditCardModel;
  @observable newDeposit: DepositCreditCardModel;
  @observable swiftRequisites: DepositSwiftModel;
  @observable gatewayUrls: GatewayUrls;
  @observable feePercentage: number = 0;

  constructor(readonly rootStore: RootStore, private api?: DepositApi) {
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
        const errMessages = {errorList: {}};
        invalidFieldsNames.forEach(fieldName => {
          errMessages[convertFieldName(fieldName)] = errors[fieldName][0];
        });
        throw {
          errMessages
        };
      }
      throw {
        message: 'Something went wrong. Please check form or try again later.'
      };
    }

    return {
      cancelUrl: response.CancelUrl,
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

  fetchSwiftRequisites = async (assetId: string) => {
    const response = await this.api!.fetchSwiftRequisites(assetId);

    if (response) {
      this.swiftRequisites = new DepositSwiftModel({
        accountName: response.AccountName || '',
        accountNumber: response.AccountNumber || '',
        bankAddress: response.BankAddress || '',
        bic: response.Bic || '',
        companyAddress: response.CompanyAddress || '',
        correspondentAccount: response.CorrespondentAccount || '',
        purposeOfPayment: response.PurposeOfPayment || ''
      });
    }
  };

  sendSwiftRequisites = async (assetId: string, amount: number) => {
    await this.api!.sendSwiftRequisites(assetId, amount);
  };

  fetchFee = async () => {
    const response = await this.api!.fetchFee();

    if (response) {
      runInAction(() => {
        this.feePercentage = response.Amount;
      });
    }
  };
}

export default DepositStore;
