export enum TransactionType {
  CashIn = 'CashIn',
  CashOut = 'CashOut',
  Trade = 'Trade',
  LimitTrade = 'LimitTrade',
  LimitTradeEvent = 'LimitTradeEvent',
  LimitOrderEvent = 'LimitOrderEvent'
}

export const TransactionTypeLabel = {
  [TransactionType.CashIn]: 'Cash in',
  [TransactionType.CashOut]: 'Cash out',
  [TransactionType.LimitOrderEvent]: 'Limit order',
  [TransactionType.LimitTrade]: 'Trade',
  [TransactionType.LimitTradeEvent]: 'Limit trade',
  [TransactionType.Trade]: 'Trade'
};

export default TransactionType;
