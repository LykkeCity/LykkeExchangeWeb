import {observable} from 'mobx';
import {RootStore} from '.';
import {WalletModel} from '../models';

export class UiStore {
  readonly rootStore: RootStore;

  @observable showCreateWalletDrawer: boolean = false;
  @observable currentWallet: WalletModel;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  readonly toggleCreateWalletDrawer = () =>
    (this.showCreateWalletDrawer = !this.showCreateWalletDrawer);
  readonly setCurrentWallet = (wallet: WalletModel) =>
    (this.currentWallet = wallet);
}

export default UiStore;
