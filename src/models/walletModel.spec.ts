import {WalletApi} from '../api/index';
import {RootStore, WalletStore} from '../stores/index';
import {AssetModel, WalletModel, WalletType} from './index';

const rootStore = new RootStore();
const mockConverter = jest.fn(() =>
  Promise.resolve({
    Converted: [
      {
        From: {
          AssetId: 'LKK'
        },
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
rootStore.assetStore.getById = jest.fn(() => ({
  id: 'LKK',
  name: 'LKK',
  // tslint:disable-next-line:object-literal-sort-keys
  category: 'Lykke'
}));

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

  describe('set balances', () => {
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

    it('should not add unknown assets to balance list', () => {
      walletSut.balances = [];
      const prev = {...rootStore.assetStore}.getById;
      rootStore.assetStore.getById = jest.fn(() => undefined);

      // act
      walletSut.setBalances([
        {
          AssetId: 'XYZ',
          Balance: 100
        }
      ]);

      expect(walletSut.balances.length).toBe(0);
      expect(walletSut.balances.map(b => b.asset.id)).not.toContain('XYZ');

      rootStore.assetStore.getById = prev;
    });
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
        walletStore.addWallet(
          walletStore.createWallet({Id: i++, Name: `w${i}`})
        );
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

  describe('withdraw', () => {
    it('should withdraw specified amount from wallet', () => {
      const wallet = walletStore.createWallet();
      wallet.setBalances([{AssetId: 'LKK', Balance: 100, Reserved: 0}]);

      wallet.withdraw(10, new AssetModel({id: 'LKK', name: 'LKK'}));

      expect(wallet.balances.find(b => b.assetId === 'LKK')!.balance).toBe(90);
    });
  });

  describe('deposit', () => {
    it('should deposit dest wallet by amount specified', () => {
      const wallet = walletStore.createWallet();
      wallet.setBalances([{AssetId: 'LKK', Balance: 100, Reserved: 0}]);

      wallet.deposit(10, new AssetModel({id: 'LKK', name: 'LKK'}));

      expect(wallet.balances.find(b => b.assetId === 'LKK')!.balance).toBe(110);
    });

    it('should deposit even if balance with asset specified not exist', () => {
      const wallet = walletStore.createWallet();
      wallet.setBalances([{AssetId: 'LKK', Balance: 100}]);

      wallet.deposit(1, new AssetModel({id: 'BTC', name: 'BTC'}));

      expect(wallet.balances.find(b => b.assetId === 'BTC')!.balance).toBe(1);
    });

    it('should not change other balances when deposit', () => {
      const wallet = walletStore.createWallet();
      wallet.setBalances([{AssetId: 'LKK', Balance: 100, Reserved: 0}]);

      wallet.deposit(1, new AssetModel({id: 'LKK2', name: 'LKK2'}));

      expect(wallet.balances.find(b => b.assetId === 'LKK')!.balance).toBe(100);
    });
  });

  describe('isDeletable', () => {
    describe('with availible balance', () => {
      it('should not be deletable', () => {
        const wallet = walletStore.createWallet({Id: 45, Name: 'w'});
        wallet.setBalances([{AssetId: 'LKK', Balance: 100}]);
        expect(wallet.hasAvailableBalance).toBeTruthy();
        expect(wallet.isDeletable).toBeFalsy();
      });
    });
    describe('with no availible balance', () => {
      it('should be deletable', () => {
        const wallet = walletStore.createWallet({Id: 46, Name: 'w'});
        expect(wallet.isDeletable).toBeTruthy();
      });
      describe('trusted', () => {
        it('should be deletable', () => {
          const w = walletStore.createWallet({
            Id: 47,
            Name: 'w',
            Type: WalletType.Trusted
          });
          expect(w.isDeletable).toBeTruthy();
        });
      });
      describe('trading', () => {
        it('should not be deletable', () => {
          const w = walletStore.createWallet({
            Id: 48,
            Name: 'w',
            Type: WalletType.Trading
          });
          expect(w.isDeletable).toBeFalsy();
        });
      });
    });
  });
});
