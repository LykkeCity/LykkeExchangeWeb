export enum TransactionStatus {
  InProgress = 'InProgress',
  Finished = 'Finished',
  Canceled = 'Canceled',
  Failed = 'Failed'
}

export const TransactionStatusLabel = {
  [TransactionStatus.Canceled]: 'canceled',
  [TransactionStatus.Failed]: 'failed',
  [TransactionStatus.Finished]: '',
  [TransactionStatus.InProgress]: 'placed'
};

export default TransactionStatus;
