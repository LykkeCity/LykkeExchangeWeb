import {computed, observable} from 'mobx';
import {RootStore} from '.';

export class UiStore {
  readonly rootStore: RootStore;

  @observable showCreateWalletDrawer: boolean = false;
  @observable showConfirmRegenerateKey: boolean = false;
  @observable showQrWindow: boolean;

  @observable pendingRequestsCount: number = 0;
  @computed
  get hasPendingRequests() {
    return this.pendingRequestsCount > 0;
  }

  @computed
  get overlayed() {
    return (
      this.showCreateWalletDrawer ||
      this.showConfirmRegenerateKey ||
      this.showQrWindow
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
}

export default UiStore;
