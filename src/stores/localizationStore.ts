import {action, computed, observable} from 'mobx';
import {RootStore} from '.';

export class LocalizationStore {
  readonly rootStore: RootStore;

  @observable i18n: Record<string, any>;
  @observable selectedLanguage: string;

  @computed
  get i18nHeader() {
    return this.i18n.Header;
  }

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
    this.selectedLanguage = localStorage.getItem('lang') || 'DE';
    this.i18n = JSON.parse(localStorage.getItem('trans') || '{}') || {};
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
        // TODO: Don't know what to do here
      });
  }

  @action
  changeLanguage = async (language: string) => {
    this.fetch(language);
  };

  changeLanguage1 = async () => {
    this.fetch('en');
  };

  private setLanguage(language: string, i18n: Record<string, any>) {
    this.selectedLanguage = language;
    Object.assign(this.i18n, i18n);
    localStorage.setItem('lang', language);
    localStorage.setItem('trans', JSON.stringify(i18n));
  }
}
