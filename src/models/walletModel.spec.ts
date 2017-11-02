import {WalletApi} from '../api/index';
import {RootStore, WalletStore} from '../stores/index';

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
const walletSut = walletStore.createWallet({Id: 42, Name: 'w'});

describe('wallet model', () => {
  it('should provide an id', () => {
    expect(walletSut).toHaveProperty('id');
    expect(walletSut.id).toBeDefined();
  });

  it('should pick an id from dto object if provided', () => {
    const w = walletStore.createWallet({Id: 43, Name: 'wl'});
    expect(w.id).toBe(43);
  });

  test('total balance in base currency should be defined', () => {
    const w = walletStore.createWallet({Id: 44, Name: 'w'});
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
});
