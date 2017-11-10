import {WalletApi} from '../api/index';
import {RootStore, WalletStore} from '../stores/index';
import {WalletModel} from './index';

const rootStore = new RootStore();
const mockConverter = jest.fn(() =>
  Promise.resolve({
    Converted: [
      {
        To: {
          Amount: 100
        }
      }
    ]
  })
);
const MockApi = jest.fn<WalletApi>(() => ({
  create: jest.fn(),
  createApiWallet: jest.fn(),
  fetchAll: jest.fn(),
  fetchBalanceById: jest.fn()
}));
const walletStore = new WalletStore(rootStore, new MockApi(), {
  convertToBaseAsset: mockConverter
} as any);
const walletSut = walletStore.createWallet('w');

describe('wallet model', () => {
  beforeEach(() => {
    walletStore.clearWallets();
  });

  it('should provide an id', () => {
    expect(walletSut).toHaveProperty('id');
    expect(walletSut.id).toBeDefined();
  });

  it('should pick an id from dto object if provided', () => {
    const w = walletStore.createWallet('wl');
    expect(w.id).toBeDefined();
    expect(w.title).toBe('wl');
  });

  test('total balance in base currency should be defined', () => {
    const w = walletStore.createWallet('w');
    expect(w.totalBalance).toBeDefined();
  });

  it('should set empty balances when passed an empty dto array', () => {
    // arrange
    const count = 3;

    // act
    walletSut.setBalances(
      Array(count).fill({
        AssetId: 'EUR',
        Balance: 100
      })
    );
    walletSut.setBalances([]);

    expect(walletSut.balances.length).toBe(0);
  });

  it('should not call converter for empty balances', () => {
    // arrange
    const count = 0;
    mockConverter.mock.calls.splice(0);

    // act
    walletSut.setBalances(
      Array(count).fill({
        AssetId: 'EUR',
        Balance: 100
      })
    );

    // assert
    expect(mockConverter.mock.calls.length).toBe(count);
  });

  it('should call converter once for each wallet', () => {
    // arrange
    const count = 5;
    mockConverter.mock.calls.splice(0);

    // act
    walletSut.setBalances(
      Array(count).fill({
        AssetId: 'EUR',
        Balance: 100
      })
    );
    walletStore.addWallet(walletSut);

    // assert
    expect(mockConverter.mock.calls.length).toBe(1);
  });

  describe('toggle collapse', () => {
    let wallet: WalletModel;

    beforeEach(() => {
      wallet = walletStore.createWallet();
    });

    it('should toggle collapsed state', () => {
      const collapsed = wallet.collapsed;

      wallet.toggleCollapse();

      expect(wallet.collapsed).toBe(!collapsed);
      expect(wallet.expanded).toBe(!wallet.collapsed);
    });

    it('should collapse all the rest wallets when expanding curr one', () => {
      for (let i = 0; i < 5; i++) {
        walletStore.addWallet(walletStore.createWallet(`w${i}`));
      }
      const currWallet = walletStore.wallets[3];
      const restWallets = walletStore.getWalletsExceptOne(currWallet);

      currWallet.collapsed = true;
      currWallet.toggleCollapse(); // expand wallet

      expect(restWallets.filter(w => w.collapsed).length).toBe(
        walletStore.wallets.length - 1
      );
      expect(restWallets.some(w => w.collapsed)).toBe(true);
      expect(restWallets.filter(w => w.expanded).length).toBe(0);
      expect(restWallets.some(w => w.expanded)).toBe(false);
    });
  });
});
