export enum TransactionType {
  CashIn = 'CashIn',
  CashOut = 'CashOut',
  Trade = 'Trade',
  LimitTrade = 'LimitTrade',
  LimitTradeEvent = 'LimitTradeEvent',
  LimitOrderEvent = 'LimitOrderEvent'
}

export const TransactionTypeLabel = {
  [TransactionType.CashIn]: 'Cash In',
  [TransactionType.CashOut]: 'Cash Out',
  [TransactionType.LimitOrderEvent]: 'Limit Order Event',
  [TransactionType.LimitTrade]: 'Limit Trade',
  [TransactionType.LimitTradeEvent]: 'Limit Trade Event',
  [TransactionType.Trade]: 'Trade'
};

export default TransactionType;
