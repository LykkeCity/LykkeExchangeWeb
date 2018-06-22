import {action, computed, observable} from 'mobx';
import {RootStore} from '.';

export class LocalizationStore {
  readonly rootStore: RootStore;

  @observable i18n: Record<string, any>;
  @observable selectedLanguage: string;

  @computed
  get currentLanguage() {
    return this.selectedLanguage.toUpperCase();
  }

  @computed
  get i18nNavBarView() {
    return this.i18n.NavBarView;
  }

  @computed
  get i18nWalletTabs() {
    return this.i18n.WalletTabs;
  }

  @computed
  get i18nWalletTotalView() {
    return this.i18n.WalletTotalView;
  }

  @computed
  get i18nNavView() {
    return this.i18n.NavView;
  }

  @computed
  get i18nWalletBalanceList() {
    return this.i18n.WalletBalanceList;
  }

  @computed
  get i18nDepositCreditCardPage() {
    return this.i18n.DepositCreditCardPage;
  }

  @computed
  get i18nDepositCreditCardForm() {
    return this.i18n.DepositCreditCardForm;
  }

  @computed
  get i18nAssetPage() {
    return this.i18n.AssetPage;
  }

  @computed
  get i18nTransferPage() {
    return this.i18n.TransferPage;
  }

  @computed
  get i18nTransferForm() {
    return this.i18n.TransferForm;
  }

  @computed
  get i18nWalletPage() {
    return this.i18n.WalletPage;
  }

  @computed
  get i18nWalletForm() {
    return this.i18n.WalletForm;
  }

  @computed
  get i18nDrawer() {
    return this.i18n.Drawer;
  }

  @computed
  get i18nEditWalletDrawer() {
    return this.i18n.EditWalletDrawer;
  }

  @computed
  get i18nEditWalletForm() {
    return this.i18n.EditWalletForm;
  }

  @computed
  get i18nGenerateWalletKeyForm() {
    return this.i18n.GenerateWalletKeyForm;
  }

  @computed
  get i18nWalletActionBar() {
    return this.i18n.WalletActionBar;
  }

  @computed
  get i18nWalletSummary() {
    return this.i18n.WalletSummary;
  }

  @computed
  get i18nSubscribe() {
    return this.i18n.Subscribe;
  }

  @computed
  get i18nFooter() {
    return this.i18n.Footer;
  }

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.selectedLanguage = localStorage.getItem('lang') || 'de';
    // TODO (Rach): Totally stuck here. No idea how to load the data the first time around without breaking the system.
    this.i18n = JSON.parse(
      '{   "NavBarView": {     "Wallets": "Wallets",     "Transfer": "Transfer"   },   "WalletTabs": {     "Trading": "Trading",     "APIWallets": "API Wallet",     "BetaBannerTitle": "Information",     "BetaBannerContent": "The web trading wallet is currently under active development. It will be improved in the coming weeks, to eventually offer the same functionalities as our mobile Lykke Wallet. In the meantime, please use our mobile application to access all fund management functionalities.",     "AndroidDownload": "Download for Android",     "IOSDownload": "Download for iOS",     "NotAgain": "Don\'t show again",     "KycBannerTitle": "KYC incomplete",     "KycBannerContent": "In order to deposit funds using credit card, please complete KYC procedure using the Lykke Wallet mobile application.",     "TradingWalletInfo": "Trading wallet is driven by LykkeWallet app.You can confirm a Trading Wallet transaction only by signing it on your mobile device.Trading Wallet is secured with 2- of - 2 multisignature protection.One key is controlled by Lykke and another one is located on your mobile device.Please keep your 12 words seed private key backup safely.",     "APIWalletInfo": "API Wallet offers you a faster trading interface.You can have multiple API wallets.Funds deposited to API wallet are under Lykke custodian.The API is secured with an API Key.Please keep the key safe.To withdraw the funds from your API wallet you need to transfer them to your Trading Wallet first.",     "APIWalletMoreInfo": "Read more about using API here",     "NewWallet": "New Wallet"   },   "WalletTotalView": {     "TotalBalance": "Total balance"   },   "NavView": {     "Services": "Services",     "Exchange": "Exchange",     "API": "API",     "APIDeposits": "API deposits",     "Listing": "Listing",     "About": "About",     "CoreTeam": "Core team",     "FAQ": "FAQ",     "Invest": "Invest",     "News": "News",     "Blog": "Blog",     "Contribute": "Contribute",     "Github": "Github",     "Streams": "Streams",     "Career": "Career",     "GetInTouch": "Get in touch",     "Contacts": "Contacts",     "HelpCenter": "Help center"   },   "WalletBalanceList": {     "NoAssets": "You don’t have any assets yet",     "Asset": "Asset",     "BaseCurrency": "Base currency",     "Amount": "Amount",     "AssetLower": "asset",     "Deposit": "Deposit",     "CreditCard": "Credit card",     "Transfer": "Transfer"   },   "AssetPage": {     "Deposit": "Deposit",     "CreditCard": "Credit card",     "Trading": "Trading",     "Trade": "Trade",     "DepositAndWithdraw": "Deposit & Withdraw",     "All": "All",     "LatestTransactions": "Latest Transactions",     "Asset": "Asset",     "Date": "Date",     "Operation": "Operation",     "Amount": "Amount",     "NoTransactions": "You don\'t have any transactions yet"   },   "DepositCreditCardPage": {     "DisclaimerErrorTitle": "Pending disclaimer",     "DisclaimerErrorText": "You need to accept pending disclaimer with your Lykke Wallet mobile app.",     "AndroidDownload": "Download for Android",     "IOSDownload": "Download for iOS",     "Deposit": "Deposit",     "CreditCard": "Credit card",     "FormDescription1": "To deposit",     "FormDescription2": "to your trading wallet please fill in the form."   },   "DepositCreditCardForm": {     "ErrorMessageText1": "Field",     "ErrorMessageText2": "should not be empty",     "DisclaimerErrorMessage": "User has pending disclaimer",     "Amount": "Amount",     "Fee": "Fee",     "FirstName": "First Name",     "LastName": "Last Name",     "Country": "Country",     "City": "City",     "ZIP": "ZIP",     "Address": "Address",     "PhoneNumber": "Phone Number",     "Email": "E-mail",     "TermsOfUse": "Terms of Use",     "Submit": "Cash In",     "Cancel": "Cancel and go back"   },   "TransferPage": {     "Transfer": "Transfer",     "TransferText": "To transfer any asset to other wallet please fill in the form.",     "Problems": "If you have any other problem contact",     "OurSupport": "our support"   },   "TransferForm": {     "TransferError": "Something went wrong",     "From": "From",     "TradingWallet": "Trading Wallet",     "APIWallet": "API Wallet",     "FromPlaceholder": "Select...",     "FromSearchPlaceholder": "Enter address of wallet or select from list...",     "Asset": "Asset",     "AssetPlaceholder": "Select...",     "AssetSearchPlaceholder": "Enter asset name or select from list...",     "To": "To",     "ToPlaceholder": "Select...",     "ToSearchPlaceholder": "Enter address of wallet or select from list...",     "Amount": "Amount",     "Submit": "Submit",     "Cancel": "Cancel and go back"   },   "WalletPage": {     "Drawer": "New API Wallet",     "NewWallet": "New Wallet",     "APIWallet": "API Wallet",     "NameStepTitle": "Name of wallet",     "GenerateStepTitle": "Generate API key",     "Save": "Save"   },   "WalletForm": {     "Name": "Name of wallet",     "NameError": "Please input the name of the wallet",     "Description": "Description",     "DescriptionPlaceholder": "Put your description, like My API Wallet",     "Submit": "Generate API Key",     "Cancel": "Cancel and close"   },   "Drawer": {    "Summary": "Summary"  },  "EditWalletDrawer": {     "Drawer": "Edit Wallet",     "APIWallet": "API Wallet",     "NameStepTitle": "Name and description"   },   "EditWalletForm": {     "Name": "Name of wallet",     "Description": "Description",     "DescriptionPlaceholder": "Put your description, like My API Wallet",     "Submit": "Save change",     "Cancel": "Cancel and close"   },   "GenerateWalletKeyForm": {     "Regenerate": "Regenerate a new API key",     "Confirm": "Yes, Change API Key",     "Cancel": "No, Back to Wallet",     "RegenerateTitle": "Regenerate API key?",     "Description1": "This action is irreversible!",     "Description2": "Previous API key will become invalid",     "Copied": "Copied!"   },   "WalletActionBar": {     "Deposit": "Deposit",     "CreditCard": "Credit Card",     "Transfer": "Transfer",     "APIKey": "API Key",     "APIKeyTitle": "Click to copy your API Key"   },   "WalletSummary": {     "NoDescription": "No description"   },   "Subscribe": {     "Title": "Newsletter",     "Details": "Get our latest news right in your mailbox",     "EmailAddress": "E-mail address"   },   "Footer": {     "PrivacyPolicy": "Privacy Policy",     "TermsOfUse": "Terms of Use"   } } '
    );
  }

  fetch(language: string): Promise<void> {
    if (
      this.selectedLanguage === language &&
      Object.keys(this.i18n).length > 0
    ) {
      return Promise.resolve();
    }

    return fetch(`/lang/${language}.json`)
      .then(resp => resp.json())
      .then(json => {
        this.setLanguage(language, json);
      })
      .catch(err => {
        // TODO (Rach): Not sure what to do here.
        // console.error(err);
      });
  }

  // TODO (Rach): Need help to combine the 2 methods below with parameter passthrough
  @action
  changeLanguageToEnglish = async (): Promise<void> => {
    this.fetch('en');
  };

  changeLanguageToGerman = async (): Promise<void> => {
    this.fetch('de');
  };

  private setLanguage(language: string, i18n: Record<string, any>) {
    this.selectedLanguage = language;
    Object.assign(this.i18n, i18n);
    localStorage.setItem('lang', language);
  }
}
