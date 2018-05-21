export enum TransactionType {
  CashIn = 'CashIn',
  CashOut = 'CashOut',
  Trade = 'Trade',
  LimitTrade = 'LimitTrade',
  LimitTradeEvent = 'LimitTradeEvent'
}

export const TransactionTypeLabel = {
  CashIn: 'Cash In',
  CashOut: 'Cash Out',
  LimitTrade: 'Limit Trade',
  LimitTradeEvent: 'Limit Trade Event',
  Trade: 'Trade'
};

export default TransactionType;
