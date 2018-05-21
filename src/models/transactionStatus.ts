export enum TransactionStatus {
  InProgress = 'InProgress',
  Finished = 'Finished',
  Canceled = 'Canceled',
  Failed = 'Failed'
}

export const TransactionStatusLabel = {
  Canceled: 'Canceled',
  Failed: 'Failed',
  Finished: 'Finished',
  InProgress: 'In Progress'
};

export default TransactionStatus;
