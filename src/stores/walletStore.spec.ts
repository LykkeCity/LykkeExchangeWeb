import {RootStore, WalletStore} from '.';
import {WalletModel} from '../models/index';

const rootStore = new RootStore();
const mockConverter = {
  convertToBaseCurrency: jest.fn(() => ({Converted: [{To: {Amount: 1}}]}))
};
const mockWalletApi = {
  createApiWallet: jest.fn((name: string) => name)
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
    wallets.push(walletStore.createWallet({title: 'wallet'}));
    expect(wallets[0]).toHaveProperty('title');
  });

  it('create api wallet should add it to the list of wallets', async () => {
    const {wallets} = walletStore;
    const wallet = await walletStore.createApiWallet(
      walletStore.createWallet({Name: '-foo'})
    );
    expect(wallets).toContainEqual(wallet);
  });

  describe('allWalletsExceptOne', () => {
    it('should not return wallet passed as param', () => {
      walletStore.clearWallets();
      const count = 5;
      for (let i = 1; i < count; i++) {
        const w = walletStore.createWallet({Id: i, Name: `Wallet ${i}`});

        walletStore.addWallet(w);
      }
      const excWallet = walletStore.createWallet({Id: 3, Name: 'Wallet 3'});
      const rest = walletStore.getAllWalletsExceptOne(excWallet);

      expect(rest.length).toBe(count - 1);
      expect(rest).not.toContainEqual(excWallet);
    });

    it('should return an empty array when filtering an empty array', () => {
      walletStore.clearWallets();
      const w = walletStore.createWallet({Id: '1', Name: 'w1'});

      expect(walletStore.getAllWalletsExceptOne(w)).not.toContainEqual(w);
      expect(walletStore.getAllWalletsExceptOne(w).length).toEqual(0);
    });
  });

  describe('convert to base asset', () => {
    let wallet: WalletModel;
    const convert = jest.fn();

    beforeEach(() => {
      walletStore.convertToBaseAsset = convert;
      wallet = walletStore.createWallet();
    });

    it('should call converter when new balance appears', () => {
      wallet.setBalances([{Balance: 100, AssetId: 'LKK'}]);
      walletStore.addWallet(wallet);

      expect(convert.mock.calls.length).toBe(1);
    });
  });
});
