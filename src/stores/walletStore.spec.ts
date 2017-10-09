import {RootStore, WalletStore} from '.';
import {WalletModel} from '../models';

const rootStore = new RootStore();
const walletStore = new WalletStore(rootStore);

describe('wallet store', () => {
  it('should hold strongly typed ref to the root store', () => {
    expect(walletStore).toHaveProperty('rootStore');
    expect(walletStore.rootStore).toBeDefined();
    expect(walletStore.rootStore).toBeInstanceOf(RootStore);
  });

  it('should expose strongly typed list of wallets', () => {
    const {wallets} = walletStore;
    expect(wallets).toBeDefined();
    wallets.push(new WalletModel({name: 'wallet'}));
    expect(wallets[0]).toHaveProperty('name');
  });
});
