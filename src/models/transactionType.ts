export enum TransactionType {
  CashIn = 'CashIn',
  CashOut = 'CashOut',
  Trade = 'Trade',
  LimitTrade = 'LimitTrade',
  LimitTradeEvent = 'LimitTradeEvent',
  LimitOrderEvent = 'LimitOrderEvent',
  OrderEvent = 'OrderEvent'
}

export const TransactionTypeLabel = {
  [TransactionType.CashIn]: 'Cash in',
  [TransactionType.CashOut]: 'Cash out',
  [TransactionType.LimitOrderEvent]: 'Limit order',
  [TransactionType.LimitTrade]: 'Trade',
  [TransactionType.LimitTradeEvent]: 'Limit trade',
  [TransactionType.OrderEvent]: 'Limit order',
  [TransactionType.Trade]: 'Trade'
};

export default TransactionType;
