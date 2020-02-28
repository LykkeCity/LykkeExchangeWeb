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
  KycPage: 'KYC Page',
  MainMenu: 'Main Menu',
  ProfilePage: 'Profile Page',
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
    title: 'Resubmit docs'
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
  ClickOnDepositLimitProgressBar: {
    details: {
      category,
      location: Place.ProfilePage,
      type: buttonClick
    },
    title: 'Click on deposit limit progress bar'
  },
  ClickOnStatusWidget: {
    details: {
      category,
      location: Place.ProfilePage,
      type: buttonClick
    },
    title: 'Click on status widget'
  },

  ClickWithdrawMenuItem: {
    details: {
      category,
      location: Place.MainMenu,
      type: buttonClick
    },
    title: 'Click on Withdraw Menu Item'
  },
  DepositLimitValidation: (type: string) => ({
    details: {
      category,
      info: {type},
      location: Place.DepositCreditCardPage,
      type: buttonClick
    },
    title: 'Deposit limit validation'
  }),
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
  Kyc: {
    ClickOnSidebar: {
      details: {
        category,
        location: Place.KycPage,
        type: buttonClick
      },
      title: 'Click on sidebar'
    },
    ClickOnYourAccount: {
      details: {
        category,
        location: Place.KycPage,
        type: buttonClick
      },
      title: 'Click on Your Account'
    },
    CloseCamera: {
      details: {
        category,
        location: Place.KycPage
      },
      title: 'Close Camera'
    },
    OpenCamera: {
      details: {
        category,
        location: Place.KycPage
      },
      title: 'Open Camera'
    },
    ResubmitFromStatusScreen: (type: string) => ({
      details: {
        category,
        info: {type},
        location: Place.KycPage,
        type: buttonClick
      },
      title: 'Resubmit from status screen'
    }),
    RetakePhoto: (type: string) => ({
      details: {
        category,
        info: {type},
        location: Place.KycPage,
        type: buttonClick
      },
      title: 'Retake photo'
    }),
    SelectedIdType: (type: string) => ({
      details: {
        category,
        info: {type},
        location: Place.KycPage,
        type: buttonClick
      },
      title: 'Select ID type'
    }),
    SkipVerificationForLater: (step: string) => ({
      details: {
        category,
        info: {step},
        location: Place.KycPage,
        type: buttonClick
      },
      title: 'Skip verification for later'
    }),
    SubmitAccountInformation: {
      details: {
        category,
        location: Place.KycPage,
        type: buttonClick
      },
      title: 'Submit account information'
    },
    SubmitLimitUpgrade: (type: string) => ({
      details: {
        category,
        info: {type},
        location: Place.KycPage,
        type: buttonClick
      },
      title: 'Submit limit upgrade'
    }),
    SubmitPhoto: (type: string) => ({
      details: {
        category,
        info: {type},
        location: Place.KycPage,
        type: buttonClick
      },
      title: 'Submit photo'
    }),
    SubmitQuestionnaire: {
      details: {
        category,
        location: Place.KycPage,
        type: buttonClick
      },
      title: 'Submit questionnaire'
    },
    TakePhoto: {
      details: {
        category,
        location: Place.KycPage,
        type: buttonClick
      },
      title: 'Take photo'
    },
    UpgradeFromStatusScreen: (type: string) => ({
      details: {
        category,
        info: {type},
        location: Place.KycPage,
        type: buttonClick
      },
      title: 'Upgrade from status screen'
    }),
    UploadFromGallery: (type: string) => ({
      details: {
        category,
        info: {type},
        location: Place.KycPage,
        type: buttonClick
      },
      title: 'Upload from gallery'
    }),
    ViewAcceptableDocs: {
      details: {
        category,
        location: Place.KycPage,
        type: buttonClick
      },
      title: 'View acceptable docs'
    }
  },
  ProceedToPaymentProvider: (assetId: string) => ({
    details: {
      category,
      info: {assetId, name: 'FXPaygate'},
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
  StartLimitUpgrade: {
    details: {
      category,
      location: Place.ProfilePage,
      type: buttonClick
    },
    title: 'Start limit upgrade'
  },
  StartTierUpgrade: (place: string) => ({
    details: {
      category,
      location: place,
      type: buttonClick
    },
    title: 'Start tier upgrade'
  }),
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
