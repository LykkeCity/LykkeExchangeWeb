import {WalletModel} from '.';
import {WalletApi} from '../api/index';
import {RootStore, WalletStore} from '../stores/index';

const rootStore = new RootStore();
const mockConverter = jest.fn(() =>
  Promise.resolve({
    Result: {
      Converted: [
        {
          To: {
            Amount: 100
          }
        }
      ]
    }
  })
);
const MockApi = jest.fn<WalletApi>(() => ({
  convertToBaseCurrency: mockConverter,
  create: jest.fn(),
  createApiWallet: jest.fn(),
  fetchAll: jest.fn(),
  fetchBalanceById: jest.fn()
}));
const walletStore = new WalletStore(rootStore, new MockApi());
const walletSut = new WalletModel({Id: 42, Name: 'w'}, walletStore);

describe('wallet model', () => {
  it('should provide an id', () => {
    expect(walletSut).toHaveProperty('id');
    expect(walletSut.id).toBeDefined();
  });

  it('should pick an id from dto object if provided', () => {
    const w = new WalletModel({Id: 42, Name: 'wl'});
    expect(w.id).toBe(42);
  });

  test('total balance in base currency should be defined', () => {
    const w = new WalletModel({Id: 42, Name: 'w'});
    expect(w.totalBalanceInBaseCurrency).toBeDefined();
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

  it('should call converter for each non-empty balance', () => {
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

    // assert
    expect(mockConverter.mock.calls.length).toBe(count);
  });

  it('should select wallet', () => {
    const w = new WalletModel();
    w.select();
    walletStore.add(w);
    expect(walletStore.selectedWallet).toBeDefined();
    expect(walletStore.selectedWallet).toBe(w);
  });
});
