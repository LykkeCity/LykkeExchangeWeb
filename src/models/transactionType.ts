export enum TransactionType {
  CashIn = 'CashIn',
  CashOut = 'CashOut',
  Trade = 'Trade',
  LimitTrade = 'LimitTrade',
  LimitTradeEvent = 'LimitTradeEvent',
  LimitOrderEvent = 'LimitOrderEvent'
}

export const TransactionTypeLabel = {
  CashIn: 'Cash In',
  CashOut: 'Cash Out',
  LimitOrderEvent: 'Limit Order Event',
  LimitTrade: 'Limit Trade',
  LimitTradeEvent: 'Limit Trade Event',
  Trade: 'Trade'
};

export default TransactionType;
