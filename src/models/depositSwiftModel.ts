export class DepositSwiftModel {
  accountName: string;
  accountNumber: string;
  amount: number = 0;
  bankAddress: string;
  bic: string;
  companyAddress: string;
  correspondentAccount: string;
  purposeOfPayment: string;

  constructor(asset: Partial<DepositSwiftModel>) {
    Object.assign(this, asset);
  }
}

export default DepositSwiftModel;
