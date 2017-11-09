export const ROUTE_ROOT = '/';

export const ROUTE_WALLETS = '/wallets';
export const ROUTE_WALLETS_PRIVATE = '/wallets/private';
export const ROUTE_WALLETS_HFT = '/wallets/hft';

export const ROUTE_TRANSFER = '/transfer/:dest/:walletId';
export const ROUTE_TRANSFER_FROM = (walletId: string) =>
  `/transfer/from/${walletId}`;
export const ROUTE_TRANSFER_TO = (walletId: string) =>
  `/transfer/to/${walletId}`;
export const ROUTE_TRANSFER_SUCCESS = '/transfer/success';

export const ROUTE_AUTH = '/auth';
