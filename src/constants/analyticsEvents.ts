const category = 'Lykke Web Wallet';
const buttonClick = 'Button Click';
const hover = 'Hover';
const event = 'Event';

export const Place = {
  AssetPage: 'Asset Page',
  DepositCreditCardPage: 'Deposit Credit Card Page',
  DepositCryptoPage: 'Deposit Crypto Page',
  DepositSwiftPage: 'Deposit SWIFT Page',
  Footer: 'Footer',
  Header: 'Header',
  HistoryPage: 'History Page',
  KycBanner: 'KYC banner',
  MainMenu: 'Main Menu',
  SecurityPage: 'Security Page',
  SettingsPage: 'Settings Page',
  SuccessPage: 'Success Page',
  WalletBalanceMenu: 'Wallet Balance Menu',
  WalletPage: 'Wallet page',
  WithdrawCryptoPage: 'Withdraw Crypto Page',
  WithdrawSwiftPage: 'Withdraw SWIFT Page'
};

export const AnalyticsEvent = {
  ChangeBaseAsset: (assetId: string) => ({
    details: {
      category,
      info: {assetId},
      location: Place.SecurityPage,
      type: event
    },
    title: 'Change Base Asset'
  }),
  CheckKycStatus: {
    details: {
      category,
      location: Place.KycBanner,
      type: buttonClick
    },
    title: 'Check KYC status'
  },
  ClickAppLink: (place: string, type: string) => ({
    details: {
      category,
      location: place,
      type: buttonClick
    },
    title: 'Click on Mobile App Link'
  }),
  ClickAssetActionsMenu: {
    details: {
      category,
      location: Place.MainMenu,
      type: buttonClick
    },
    title: 'Click on Asset Actions Menu'
  },
  ClickAssetIcon: (place: string) => ({
    details: {
      category,
      location: place,
      type: buttonClick
    },
    title: 'Click on Asset Icon'
  }),
  ClickAssetName: (place: string) => ({
    details: {
      category,
      location: place,
      type: buttonClick
    },
    title: 'Click on Asset Name'
  }),
  ClickAssetPageQrArea: {
    details: {
      category,
      location: Place.AssetPage,
      type: buttonClick
    },
    title: 'Click on Asset Page QR area'
  },
  ClickAssetQR: {
    details: {
      category,
      location: Place.WalletPage,
      type: buttonClick
    },
    title: 'Click on Asset QR Icon'
  },
  ClickColumnHeader: (name: string, place: string) => ({
    details: {
      category,
      info: {name},
      location: place,
      type: buttonClick
    },
    title: 'Click on Column Header'
  }),
  ClickDepositMenuItem: {
    details: {
      category,
      location: Place.MainMenu,
      type: buttonClick
    },
    title: 'Click on Deposit Menu Item'
  },
  ClickHistoryMenuItem: {
    details: {
      category,
      location: Place.MainMenu,
      type: buttonClick
    },
    title: 'Click on History Menu Item'
  },
  Enable2fa: {
    details: {
      category,
      location: Place.SecurityPage,
      type: buttonClick
    },
    title: 'Enable 2FA'
  },
  ExportTransactionHistory: (filter: string, place: string) => ({
    details: {
      category,
      info: {filter},
      location: place,
      type: buttonClick
    },
    title: 'Export Transaction History'
  }),
  FilterTransactionHistory: (filter: string, place: string) => ({
    details: {
      category,
      info: {filter},
      location: place,
      type: buttonClick
    },
    title: 'Filter Transaction History'
  }),
  FinishDeposit: (place: string, type: string, assetId: string) => ({
    details: {
      category,
      info: {assetId, type},
      location: place,
      type: event
    },
    title: 'Finish Deposit'
  }),
  FinishWithdraw: (place: string, type: string, assetId: string) => ({
    details: {
      category,
      info: {assetId, type},
      location: place,
      type: event
    },
    title: 'Finish Withdraw'
  }),
  GoBack: (place: string, source: string) => ({
    details: {
      category,
      info: {source},
      location: place,
      type: buttonClick
    },
    title: 'Go Back'
  }),
  GoToTrade: {
    details: {
      category,
      location: Place.AssetPage,
      type: buttonClick
    },
    title: 'Go Trade'
  },
  HoverAssetQR: {
    details: {
      category,
      location: Place.WalletPage,
      type: hover
    },
    title: 'Hover over Asset QR Icon'
  },
  ProceedToPaymentProvider: (assetId: string) => ({
    details: {
      category,
      info: {assetId, name: 'Link4Pay'},
      location: Place.DepositCreditCardPage,
      type: event
    },
    title: 'Proceed to Payment Provider'
  }),
  Start2faSetup: {
    details: {
      category,
      location: Place.WithdrawCryptoPage,
      type: buttonClick
    },
    title: 'Start 2FA Setup from the Banner'
  },
  StartConfirmWithdraw: {
    details: {
      category,
      info: {type: 'Blockchain Transfer'},
      location: Place.WithdrawCryptoPage,
      type: event
    },
    title: 'Start Confirm Withdrawal'
  },
  StartDeposit: (place: string, type: string, assetId: string) => ({
    details: {
      category,
      info: {assetId, type},
      location: place,
      type: buttonClick
    },
    title: 'Start Deposit'
  }),
  StartKyc: {
    details: {
      category,
      location: Place.KycBanner,
      type: buttonClick
    },
    title: 'Start KYC'
  },
  StartWithdraw: (place: string, type: string, assetId: string) => ({
    details: {
      category,
      info: {assetId, type},
      location: place,
      type: buttonClick
    },
    title: 'Start Withdraw'
  }),
  ViewTermsOfUse: (place: string) => ({
    details: {
      category,
      location: place,
      type: buttonClick
    },
    title: 'View Terms of Use'
  })
};
