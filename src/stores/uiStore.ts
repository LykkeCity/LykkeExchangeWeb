import {computed, observable, reaction} from 'mobx';
import {RootStore} from '.';

export class UiStore {
  readonly rootStore: RootStore;

  @observable showWalletDrawer: boolean = false;
  @observable showConfirmRegenerateKey: boolean = false;
  @observable showConfirmRemoveWallet: boolean = false;
  @observable showQrWindow: boolean;
  @observable showSidebar: boolean;
  @observable showBaseCurrencyPicker: boolean;
  @observable transferError: string;
  @observable apiError: string;

  @observable pendingRequestsCount: number = 0;
  @computed
  get hasPendingRequests() {
    return this.pendingRequestsCount > 0;
  }

  @computed
  get appLoaded() {
    return !this.hasPendingRequests && !!this.rootStore.authStore.token;
  }

  @computed
  get overlayed() {
    return (
      this.showWalletDrawer ||
      this.showConfirmRegenerateKey ||
      this.showQrWindow ||
      this.showSidebar
    );
  }

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    reaction(
      () => this.pendingRequestsCount,
      count => {
        if (count < 0) {
          this.pendingRequestsCount = 0;
        }
      }
    );
  }

  readonly startRequest = (num: number = 1) =>
    (this.pendingRequestsCount += num);
  readonly finishRequest = (num: number = 1) => {
    this.pendingRequestsCount -= num;
  };
  readonly clearPendingRequests = () => (this.pendingRequestsCount = 0);

  readonly toggleWalletDrawer = () => {
    this.showWalletDrawer = !this.showWalletDrawer;
  };

  readonly toggleConfirmRegenerateKey = () => {
    this.showConfirmRegenerateKey = !this.showConfirmRegenerateKey;
  };

  readonly toggleConfirmRemoveWallet = () => {
    this.showConfirmRemoveWallet = !this.showConfirmRemoveWallet;
  };

  readonly toggleQrWindow = () => (this.showQrWindow = !this.showQrWindow);
  readonly closeQrWindow = () => (this.showQrWindow = false);

  readonly toggleSidebar = () => (this.showSidebar = !this.showSidebar);

  readonly closeSidebar = () =>
    this.showSidebar && (this.showSidebar = !this.showSidebar);

  readonly toggleBaseAssetPicker = () =>
    (this.showBaseCurrencyPicker = !this.showBaseCurrencyPicker);
}

export default UiStore;
