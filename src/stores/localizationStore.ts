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
  get i18nWalletTotalView() {
    return this.i18n.WalletTotalView;
  }

  @computed
  get i18nNavBarView() {
    return this.i18n.NavBarView;
  }

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.selectedLanguage = localStorage.getItem('lang') || 'de';
    this.i18n =
      JSON.parse(
        localStorage.getItem('trans') ||
          '{  "NavBarView": {        "Wallets": "Walletski",        "Transfer": "Transferski"      },      "WalletTotalView": {        "TotalBalance": "Kontostand"      }}'
      ) || {};
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
    localStorage.setItem('trans', JSON.stringify(i18n));
  }
}
