import {MenuItem} from '@lykkecity/react-components';
import {action, computed, observable, reaction} from 'mobx';
import {RootStore} from '.';
import {getHash, StorageUtils} from '../utils';

const BETA_BANNER_HASHES_STORAGE_KEY = 'lww-beta-banner-hashes';
const betaBannerHashesStorage = StorageUtils.withKey(
  BETA_BANNER_HASHES_STORAGE_KEY
);

export class UiStore {
  readonly rootStore: RootStore;

  @observable showWhitelistingDrawer: boolean = false;
  @observable showWalletDrawer: boolean = false;
  @observable showEditWalletDrawer: boolean = false;
  @observable showConfirmRegenerateKey: boolean = false;
  @observable showQrWindow: boolean;
  @observable showBaseCurrencyPicker: boolean;
  @observable showBetaBanner: boolean;
  @observable showEthWarning: boolean = false;
  @observable showAssetAddressModal: boolean = false;
  @observable transferError: string;
  @observable apiError: string;
  @observable activeHeaderMenuItem: string = MenuItem.Funds;
  @observable cookieBannerVisible: boolean = false;

  @observable pendingRequestsCount: number = 0;
  @computed
  get hasPendingRequests() {
    return this.pendingRequestsCount > 0;
  }

  @computed
  get hasVisibleDialogs() {
    return this.rootStore.dialogStore.assetDisclaimers.some(
      dialog => dialog.visible
    );
  }

  @computed
  get appLoaded() {
    return !this.hasPendingRequests && !!this.rootStore.authStore.token;
  }

  @computed
  get overlayed() {
    return (
      this.showWhitelistingDrawer ||
      this.showWalletDrawer ||
      this.showEditWalletDrawer ||
      this.showConfirmRegenerateKey ||
      this.showQrWindow ||
      this.hasVisibleDialogs ||
      this.showEthWarning ||
      this.showAssetAddressModal ||
      this.rootStore.depositStore.showMaxDepositErrorDialog ||
      this.rootStore.kycStore.showUpdateAccountErrorModal ||
      this.rootStore.kycStore.showUpdateQuestionnaireErrorModal ||
      this.rootStore.kycStore.showFileUploadServerErrorModal
    );
  }

  @computed
  get drawerOverlayed() {
    return this.showConfirmRegenerateKey;
  }

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    reaction(
      () => this.rootStore.profileStore.email,
      email => {
        const betaBannerHashes = JSON.parse(
          betaBannerHashesStorage.get() || '[]'
        );
        this.showBetaBanner = !betaBannerHashes.includes(getHash(email));
      }
    );
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

  readonly toggleWhitelistingDrawer = () => {
    this.showWhitelistingDrawer = !this.showWhitelistingDrawer;
  };

  readonly toggleEditWalletDrawer = () => {
    this.showEditWalletDrawer = !this.showEditWalletDrawer;
  };

  readonly toggleConfirmRegenerateKey = () => {
    this.showConfirmRegenerateKey = !this.showConfirmRegenerateKey;
  };

  readonly toggleQrWindow = () => (this.showQrWindow = !this.showQrWindow);
  readonly closeQrWindow = () => (this.showQrWindow = false);

  readonly toggleBaseAssetPicker = () =>
    (this.showBaseCurrencyPicker = !this.showBaseCurrencyPicker);

  @action
  readonly hideBetaBanner = () => {
    const betaBannerHashes = JSON.parse(betaBannerHashesStorage.get() || '[]');
    betaBannerHashes.push(getHash(this.rootStore.profileStore.email));
    betaBannerHashesStorage.set(JSON.stringify(betaBannerHashes));
    this.showBetaBanner = false;
  };

  @action
  readonly hideModals = () => {
    this.showConfirmRegenerateKey = false;
    this.showEthWarning = false;
    this.showAssetAddressModal = false;
  };

  setCookieBannerVisibility = (val: boolean) => {
    this.cookieBannerVisible = val;
  };
}

export default UiStore;
