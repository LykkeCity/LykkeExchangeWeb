import {action, computed, observable, reaction} from 'mobx';
import {RootStore} from '.';
import {StorageUtils} from '../utils';

const BETA_BANNER_HIDDEN_STORAGE_KEY = 'lww-beta-banner-hidden';
const betaBannerHiddenStorage = StorageUtils.withKey(
  BETA_BANNER_HIDDEN_STORAGE_KEY
);

export class UiStore {
  readonly rootStore: RootStore;

  @observable showWalletDrawer: boolean = false;
  @observable showEditWalletDrawer: boolean = false;
  @observable showConfirmRegenerateKey: boolean = false;
  @observable showQrWindow: boolean;
  @observable showSidebar: boolean;
  @observable showBaseCurrencyPicker: boolean;
  @observable showBetaBanner: boolean = !betaBannerHiddenStorage.get();
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
      this.showEditWalletDrawer ||
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

  readonly toggleEditWalletDrawer = () => {
    this.showEditWalletDrawer = !this.showEditWalletDrawer;
  };

  readonly toggleConfirmRegenerateKey = () => {
    this.showConfirmRegenerateKey = !this.showConfirmRegenerateKey;
  };

  readonly toggleQrWindow = () => (this.showQrWindow = !this.showQrWindow);
  readonly closeQrWindow = () => (this.showQrWindow = false);

  readonly toggleSidebar = () => (this.showSidebar = !this.showSidebar);

  readonly closeSidebar = () =>
    this.showSidebar && (this.showSidebar = !this.showSidebar);

  readonly toggleBaseAssetPicker = () =>
    (this.showBaseCurrencyPicker = !this.showBaseCurrencyPicker);

  @action
  readonly hideBetaBanner = () => {
    betaBannerHiddenStorage.set(true);
    this.showBetaBanner = false;
  };
}

export default UiStore;
