export const ROUTE_ROOT = '/';
export const ROUTE_WALLET = '/wallets';
export const ROUTE_TRANSFER = '/transfer';
export const ROUTE_WALLET_TRANSFER = `${ROUTE_WALLET}/:walletId${ROUTE_TRANSFER}`;
export const ROUTE_WALLET_TRANSFER_FROM = (walletId: string) =>
  `${ROUTE_WALLET}/${walletId}${ROUTE_TRANSFER}`;
export const ROUTE_WALLET_TRANSFER_TO = (walletId: string) =>
  `${ROUTE_WALLET}/${walletId}${ROUTE_TRANSFER}`;
export const ROUTE_TRANSFER_SUCCESS = '/transfer/success';
export const ROUTE_AUTH = '/auth';

export const ROUTE_HOME = ROUTE_WALLET;
