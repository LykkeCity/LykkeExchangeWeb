import {computed, observable} from 'mobx';
import {RootStore} from '.';

export class UiStore {
  readonly rootStore: RootStore;

  @observable showCreateWalletDrawer: boolean = false;
  @observable showConfirmRegenerateKey: boolean = false;
  @observable showQrWindow: boolean;
  @observable showSidebar: boolean;

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
      this.showCreateWalletDrawer ||
      this.showConfirmRegenerateKey ||
      this.showQrWindow ||
      this.showSidebar
    );
  }

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  startFetch = (num?: number) =>
    !!num ? (this.pendingRequestsCount += num) : this.pendingRequestsCount++;
  finishFetch = () => this.pendingRequestsCount--;

  readonly toggleCreateWalletDrawer = () => {
    this.showCreateWalletDrawer = !this.showCreateWalletDrawer;
  };

  readonly toggleConfirmRegenerateKey = () => {
    this.showConfirmRegenerateKey = !this.showConfirmRegenerateKey;
  };

  readonly toggleQrWindow = () => (this.showQrWindow = !this.showQrWindow);
  readonly toggleSidebar = () => (this.showSidebar = !this.showSidebar);
  readonly closeSidebar = () =>
    this.showSidebar && (this.showSidebar = !this.showSidebar);
}

export default UiStore;
