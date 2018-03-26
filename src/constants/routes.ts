export const ROUTE_ROOT = '/';

export const ROUTE_WALLETS = '/wallets';
export const ROUTE_WALLETS_TRADING = '/wallets/trading';
export const ROUTE_WALLETS_HFT = '/wallets/hft';

export const ROUTE_TRANSFER_BASE = '/transfer';
export const ROUTE_TRANSFER = `${ROUTE_TRANSFER_BASE}/:dest/:walletId/:assetId?`;
export const ROUTE_TRANSFER_FROM = (walletId: string, assetId = '') =>
  `${ROUTE_TRANSFER_BASE}/from/${walletId}/${assetId}`;
export const ROUTE_TRANSFER_TO = (walletId: string) =>
  `${ROUTE_TRANSFER_BASE}/to/${walletId}`;
export const ROUTE_TRANSFER_SUCCESS = `${ROUTE_TRANSFER_BASE}/success`;
export const ROUTE_TRANSFER_FAIL = `${ROUTE_TRANSFER_BASE}/fail`;

export const ROUTE_AFFILIATE = '/affiliate';
export const ROUTE_AFFILIATE_STATISTICS = `${ROUTE_AFFILIATE}/statistics`;
export const ROUTE_AFFILIATE_DETAILS = `${ROUTE_AFFILIATE}/details`;

export const ROUTE_DEPOSIT_CREDIT_CARD_BASE = '/deposit/credit-card';
export const ROUTE_DEPOSIT_CREDIT_CARD = `${ROUTE_DEPOSIT_CREDIT_CARD_BASE}/:walletId/:assetId?`;
export const ROUTE_DEPOSIT_CREDIT_CARD_TO = (walletId: string, assetId = '') =>
  `${ROUTE_DEPOSIT_CREDIT_CARD_BASE}/${walletId}/${assetId}`;
export const ROUTE_DEPOSIT_CREDIT_CARD_GATEWAY = `${ROUTE_DEPOSIT_CREDIT_CARD_BASE}/gateway`;
export const ROUTE_DEPOSIT_CREDIT_CARD_SUCCESS = `${ROUTE_DEPOSIT_CREDIT_CARD_BASE}/success`;
export const ROUTE_DEPOSIT_CREDIT_CARD_FAIL = `${ROUTE_DEPOSIT_CREDIT_CARD_BASE}/fail`;

export const ROUTE_GATEWAY_SUCCESS = '/gateway/success';
export const ROUTE_GATEWAY_FAIL = '/gateway/fail';

export const ROUTE_AUTH = '/auth';
