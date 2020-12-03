export const ROUTE_ROOT = '/';

export const ROUTE_ASSET_PAGE = '/asset/:assetId';
export const ROUTE_ASSET = (assetId: string) => `/asset/${assetId}`;

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

export const ROUTE_DEPOSIT_SWIFT_BASE = '/deposit/swift';
export const ROUTE_DEPOSIT_SWIFT = `${ROUTE_DEPOSIT_SWIFT_BASE}/:assetId`;
export const ROUTE_DEPOSIT_SWIFT_TO = (assetId: string) =>
  `${ROUTE_DEPOSIT_SWIFT_BASE}/${assetId}`;
export const ROUTE_DEPOSIT_SWIFT_EMAIL_SENT = `${ROUTE_DEPOSIT_SWIFT_BASE}/success`;

export const ROUTE_DEPOSIT_CRYPTO_BASE = '/deposit/crypto';
export const ROUTE_DEPOSIT_CRYPTO = `${ROUTE_DEPOSIT_CRYPTO_BASE}/:assetId`;
export const ROUTE_DEPOSIT_CRYPTO_TO = (assetId: string) =>
  `${ROUTE_DEPOSIT_CRYPTO_BASE}/${assetId}`;

export const ROUTE_HISTORY = '/history';

export const ROUTE_PROFILE = '/profile';
export const ROUTE_SECURITY = '/profile/security';
export const ROUTE_VERIFICATION = '/profile/kyc';

export const ROUTE_CONFIRM_OPERATION_BASE = '/operation/confirm';
export const ROUTE_CONFIRM_OPERATION = `${ROUTE_CONFIRM_OPERATION_BASE}/:operationId`;
export const ROUTE_CONFIRM_OPERATION_ID = (operationId: string) =>
  `${ROUTE_CONFIRM_OPERATION_BASE}/${operationId}`;

export const ROUTE_WITHDRAW_CRYPTO_BASE = '/withdraw/crypto';
export const ROUTE_WITHDRAW_CRYPTO = `${ROUTE_WITHDRAW_CRYPTO_BASE}/:assetId`;
export const ROUTE_WITHDRAW_CRYPTO_FROM = (assetId: string) =>
  `${ROUTE_WITHDRAW_CRYPTO_BASE}/${assetId}`;
export const ROUTE_WITHDRAW_CRYPTO_SUCCESS = `${ROUTE_WITHDRAW_CRYPTO_BASE}/success`;
export const ROUTE_WITHDRAW_CRYPTO_FAIL = `${ROUTE_WITHDRAW_CRYPTO_BASE}/fail`;

export const ROUTE_WITHDRAW_SWIFT_BASE = '/withdraw/swift';
export const ROUTE_WITHDRAW_SWIFT = `${ROUTE_WITHDRAW_SWIFT_BASE}/:assetId`;
export const ROUTE_WITHDRAW_SWIFT_FROM = (assetId: string) =>
  `${ROUTE_WITHDRAW_SWIFT_BASE}/${assetId}`;
export const ROUTE_WITHDRAW_SWIFT_SUCCESS = `${ROUTE_WITHDRAW_SWIFT_BASE}/success`;
export const ROUTE_WITHDRAW_SWIFT_FAIL = `${ROUTE_WITHDRAW_SWIFT_BASE}/fail`;

export const ROUTE_AUTH = '/auth';

export const ROUTE_LKK_INVESTMENT = '/lkk-investment';
export const ROUTE_LKK_INVESTMENT_SUCCESS = `${ROUTE_LKK_INVESTMENT}/success`;
