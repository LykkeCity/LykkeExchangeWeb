import {observable} from 'mobx';
import {RootStore} from '.';

export class UiStore {
  readonly rootStore: RootStore;

  @observable showCreateWalletDrawer: boolean = false;
  @observable showConfirmRegenerateKey: boolean = false;
  @observable baseCurrency: string = 'LKK';

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  readonly toggleCreateWalletDrawer = () => {
    this.showCreateWalletDrawer = !this.showCreateWalletDrawer;
  };

  readonly toggleConfirmRegenerateKey = () => {
    this.showConfirmRegenerateKey = !this.showConfirmRegenerateKey;
  };
}

export default UiStore;
