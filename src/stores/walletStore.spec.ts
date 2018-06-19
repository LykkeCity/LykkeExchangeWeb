import {RootStore, WalletStore} from '.';
import {WalletModel} from '../models/index';

const rootStore = new RootStore();
const mockWalletApi = {
  createApiWallet: jest.fn((name: string) => name)
};
const walletStore = new WalletStore(rootStore, mockWalletApi as any);
rootStore.assetStore.getById = jest.fn(() => ({
  id: '1',
  name: 'asset1',
  // tslint:disable-next-line:object-literal-sort-keys
  category: 'Lykke'
}));

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
    beforeEach(() => {
      walletStore.clearWallets();
    });
    it('should not return wallet passed as param', () => {
      const count = 5;
      for (let i = 1; i < count; i++) {
        walletStore.addWallet(
          walletStore.createWallet({Id: i, Name: `Wallet ${i}`})
        );
      }
      const excludeWallet = walletStore.wallets[2];
      const rest = walletStore.getWalletsExceptOne(excludeWallet);

      expect(rest.length).toBe(walletStore.wallets.length - 1);
      expect(rest).not.toContain(excludeWallet);
    });

    it('should return an empty array when filtering an empty array', () => {
      walletStore.clearWallets();
      const w = walletStore.createWallet({Id: '1', Name: 'w1'});

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
