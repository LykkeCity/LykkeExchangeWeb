import {observable} from 'mobx';
import {RootStore} from '.';

export class UiStore {
  readonly rootStore: RootStore;

  @observable showCreateWalletDrawer: boolean = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  readonly toggleCreateWalletDrawer = () =>
    (this.showCreateWalletDrawer = !this.showCreateWalletDrawer);
}

export default UiStore;
