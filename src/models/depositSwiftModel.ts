export class DepositSwiftModel {
  accountName: string;
  accountNumber: string;
  amount: number = 0;
  bankAddress: string;
  bic: string;
  companyAddress: string;
  correspondentAccount: string;
  purposeOfPayment: string;

  constructor(depositSwift?: Partial<DepositSwiftModel>) {
    Object.assign(this, depositSwift);
  }
}

export default DepositSwiftModel;
