export const ROUTE_ROOT = '/';

export const ROUTE_WALLETS = '/wallets';
export const ROUTE_WALLETS_PRIVATE = '/wallets/private';
export const ROUTE_WALLETS_HFT = '/wallets/hft';

export const ROUTE_TRANSFER_BASE = '/transfer';
export const ROUTE_TRANSFER = `${ROUTE_TRANSFER_BASE}/:dest/:walletId`;
export const ROUTE_TRANSFER_FROM = (walletId: string) =>
  `${ROUTE_TRANSFER_BASE}/from/${walletId}`;
export const ROUTE_TRANSFER_TO = (walletId: string) =>
  `${ROUTE_TRANSFER_BASE}/to/${walletId}`;
export const ROUTE_TRANSFER_SUCCESS = `${ROUTE_TRANSFER_BASE}/success`;
export const ROUTE_TRANSFER_FAIL = `${ROUTE_TRANSFER_BASE}/fail`;

export const ROUTE_AUTH = '/auth';
export const ROUTE_LOGIN = '/login';
