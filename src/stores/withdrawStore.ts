import {action, observable} from 'mobx';
import {RootStore} from '.';
import {WithdrawApi} from '../api/withdrawApi';
import {WithdrawCryptoModel, WithdrawSwiftModel} from '../models';

export class WithdrawStore {
  @observable withdrawCrypto: WithdrawCryptoModel;
  @observable withdrawSwift: WithdrawSwiftModel;
  @observable relativeFee: number = 0;
  @observable absoluteFee: number = 0;
  @observable isAddressExtensionMandatory: boolean = false;
  @observable baseAddressTitle: string = 'To';
  @observable addressExtensionTitle: string = 'Address Extension';

  constructor(readonly rootStore: RootStore, private api: WithdrawApi) {
    this.resetCurrentWithdraw();
  }

  validateWithdrawCryptoRequest = async (
    assetId: string,
    values: WithdrawCryptoModel
  ) => {
    this.withdrawCrypto.amount = values.amount;
    this.withdrawCrypto.assetId = assetId;
    this.withdrawCrypto.baseAddress = values.baseAddress;
    this.withdrawCrypto.addressExtension = values.addressExtension || '';
    const resp = await this.api!.validateWithdrawCryptoRequest(
      assetId,
      this.withdrawCrypto
    );
    return resp.IsValid;
  };

  sendWithdrawCryptoRequest = async (
    assetId: string,
    values: WithdrawCryptoModel
  ) => {
    this.withdrawCrypto.amount = values.amount;
    this.withdrawCrypto.assetId = assetId;
    this.withdrawCrypto.baseAddress = values.baseAddress;
    this.withdrawCrypto.addressExtension = values.addressExtension;
    return await this.api!.sendWithdrawCryptoRequest(this.withdrawCrypto);
  };

  sendWithdrawSwiftRequest = async (
    assetId: string,
    values: WithdrawSwiftModel
  ) => {
    this.withdrawSwift.amount = values.amount;
    this.withdrawSwift.assetId = assetId;
    this.withdrawSwift.accountName = values.accountName;
    this.withdrawSwift.accountNumber = values.accountNumber;
    this.withdrawSwift.bankName = values.bankName;
    this.withdrawSwift.bic = values.bic;
    this.withdrawSwift.accHolderAddress = values.accHolderAddress;
    this.withdrawSwift.accHolderCity = values.accHolderCity;
    this.withdrawSwift.accHolderZipCode = values.accHolderZipCode;

    return await this.api!.sendWithdrawSwiftRequest(this.withdrawSwift);
  };

  confirmWithdrawCryptoRequest = async (operationId: string, code: string) => {
    return await this.api!.confirmWithdrawCryptoRequest(operationId, code);
  };

  @action
  fetchSwiftDefaultValues = async () => {
    const response = await this.api!.fetchSwiftDefaultValues();

    if (response) {
      this.withdrawSwift = new WithdrawSwiftModel({
        accHolderAddress: response.AccHolderAddress || '',
        accHolderCity: response.AccHolderCity || '',
        accHolderZipCode: response.AccHolderZipCode || '',
        accountName: response.AccName || '',
        accountNumber: response.AccNumber || '',
        bankName: response.BankName || '',
        bic: response.Bic || ''
      });
    }
  };

  @action
  fetchWithdrawCryptoInfo = async (assetId: string) => {
    const resp = await this.api!.fetchWithdrawCryptoInfo(assetId);

    this.isAddressExtensionMandatory = resp.AddressExtensionMandatory;
    this.withdrawCrypto.isExtensionMandatory = resp.AddressExtensionMandatory;
    if (resp.BaseAddressTitle) {
      this.baseAddressTitle = resp.BaseAddressTitle;
    }
    if (resp.AddressExtensionTitle) {
      this.addressExtensionTitle = resp.AddressExtensionTitle;
    }
  };

  fetchWithdrawOperation = async (operationId: string) =>
    await this.api!.fetchWithdrawOperation(operationId);

  cancelWithdrawOperation = async (operationId: string) =>
    await this.api!.cancelWithdrawOperation(operationId);

  @action
  fetchFee = async (assetId: string) => {
    const resp = await this.api.fetchFee(assetId);
    const FeeType = {
      Absolute: 'Absolute',
      Relative: 'Relative'
    };

    if (resp) {
      this.withdrawCrypto.fee = resp.Size;
    }

    if (resp && resp.Type === FeeType.Absolute) {
      this.absoluteFee = resp.Size;
    }

    if (resp && resp.Type === FeeType.Relative) {
      this.relativeFee = resp.Size;
    }
  };

  @action
  resetCurrentWithdraw = () => {
    this.withdrawCrypto = new WithdrawCryptoModel();
    this.withdrawSwift = new WithdrawSwiftModel();
    this.relativeFee = 0;
    this.absoluteFee = 0;
    this.isAddressExtensionMandatory = false;
    this.baseAddressTitle = 'To';
    this.addressExtensionTitle = 'Address Extension';
  };
}

export default WithdrawStore;
