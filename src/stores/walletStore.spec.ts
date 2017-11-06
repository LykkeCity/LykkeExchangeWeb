import {RootStore, WalletStore} from '.';
import {WalletModel} from '../models/index';

const rootStore = new RootStore();
const mockConverter = {
  convertToBaseCurrency: jest.fn(() => ({Converted: [{To: {Amount: 1}}]}))
};
const mockWalletApi = {
  createApiWallet: jest.fn((name: string) => ({WalletId: '1'}))
};
const walletStore = new WalletStore(
  rootStore,
  mockWalletApi as any,
  mockConverter as any
);

describe('wallet store', () => {
  it('should hold strongly typed ref to the root store', () => {
    expect(walletStore).toHaveProperty('rootStore');
    expect(walletStore.rootStore).toBeDefined();
    expect(walletStore.rootStore).toBeInstanceOf(RootStore);
  });

  it('should expose strongly typed list of wallets', () => {
    const {wallets} = walletStore;
    expect(wallets).toBeDefined();
    walletStore.updateFromServer({title: 'wallet'});
    // wallets.push(walletStore.createWallet({title: 'wallet'}));
    expect(wallets[0]).toHaveProperty('title');
  });

  it('create api wallet should add it to the list of wallets', async () => {
    const {wallets} = walletStore;
    const wallet = await walletStore.createApiWallet(
      walletStore.createWallet('1', '-foo')
    );
    expect(wallets).toContainEqual(wallet);
  });

  describe('allWalletsExceptOne', () => {
    beforeEach(() => {
      walletStore.clearWallets();
    });
    it('should not return wallet passed as param', () => {
      const count = 5;
      for (let i = 1; i < count; i++) {
        walletStore.addWallet(walletStore.createWallet(i, `Wallet ${i}`));
      }
      const excludeWallet = walletStore.createWallet(3, 'Wallet 3');
      const rest = walletStore.getWalletsExceptOne(excludeWallet);

      expect(rest.length).toBe(count - 1);
      expect(rest).not.toContain(excludeWallet);
    });

    it('should return an empty array when filtering an empty array', () => {
      walletStore.clearWallets();
      const w = walletStore.createWallet('1', 'w1');

      expect(walletStore.getWalletsExceptOne(w)).not.toContainEqual(w);
      expect(walletStore.getWalletsExceptOne(w).length).toEqual(0);
    });
  });

  describe('convert to base asset', () => {
    let wallet: WalletModel;
    const convert = jest.fn();

    beforeEach(() => {
      walletStore.convertBalances = convert;
      wallet = walletStore.createWallet();
    });

    it('should call converter when new balance appears', () => {
      wallet.setBalances([{Balance: 100, AssetId: 'LKK'}]);
      walletStore.addWallet(wallet);

      expect(convert.mock.calls.length).toBe(1);
    });
  });
});
