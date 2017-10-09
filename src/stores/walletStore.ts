import {observable} from 'mobx';
import {RootStore} from '.';
import {WalletModel} from '../models';

export class WalletStore {
  readonly rootStore: RootStore;

  @observable wallets: WalletModel[] = [];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    for (let i = 0; i < 3; i++) {
      this.wallets.push(new WalletModel({id: `w${i}`, name: `Wallet #${i}`}));
    }
  }
}

export default WalletStore;
