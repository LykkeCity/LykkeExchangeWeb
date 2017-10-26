import {computed, observable} from 'mobx';
import {RootStore} from '.';

export class UiStore {
  readonly rootStore: RootStore;

  @observable showCreateWalletDrawer: boolean = false;
  @observable showConfirmRegenerateKey: boolean = false;
  @observable showQrWindow: boolean;
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

  readonly toggleCreateWalletDrawer = () => {
    this.showCreateWalletDrawer = !this.showCreateWalletDrawer;
  };

  readonly toggleConfirmRegenerateKey = () => {
    this.showConfirmRegenerateKey = !this.showConfirmRegenerateKey;
  };

  readonly toggleQrWindow = () => (this.showQrWindow = !this.showQrWindow);
}

export default UiStore;
