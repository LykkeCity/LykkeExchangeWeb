import {AssetModel, TransactionStatus, TransactionType} from './';

export class TransactionModel {
  id: string;
  dateTime: Date;
  type: TransactionType;
  state: TransactionStatus;
  amount: number;
  asset: AssetModel;

  constructor(transaction?: Partial<TransactionModel>) {
    Object.assign(this, transaction);
  }
}

export default TransactionModel;
