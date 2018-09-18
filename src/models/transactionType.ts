export enum TransactionType {
  CashIn = 'CashIn',
  CashOut = 'CashOut',
  Trade = 'Trade'
}

export const TransactionTypeLabel = {
  [TransactionType.CashIn]: 'Cash in',
  [TransactionType.CashOut]: 'Cash out',
  [TransactionType.Trade]: 'Trade'
};

export default TransactionType;
