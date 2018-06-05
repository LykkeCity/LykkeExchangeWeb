export enum TransactionStatus {
  InProgress = 'InProgress',
  Finished = 'Finished',
  Canceled = 'Canceled',
  Failed = 'Failed'
}

export const TransactionStatusLabel = {
  [TransactionStatus.Canceled]: 'Canceled',
  [TransactionStatus.Failed]: 'Failed',
  [TransactionStatus.Finished]: 'Finished',
  [TransactionStatus.InProgress]: 'In Progress'
};

export default TransactionStatus;
