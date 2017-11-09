import {RootStore, WalletBalanceStore} from './index';

const rootStore = new RootStore();
const walletBalanceStore = new WalletBalanceStore(rootStore);

describe('balance wallet store', () => {
  it('should hold strongly typed ref to the root store', () => {
    expect(walletBalanceStore).toHaveProperty('rootStore');
    expect(walletBalanceStore.rootStore).toBeDefined();
    expect(walletBalanceStore.rootStore).toBeInstanceOf(RootStore);
  });

  describe('updateFromServer', () => {
    beforeEach(() => {
      walletBalanceStore.clearBalancesAll();
    });

    it('should create a new wallet if received a new one from server', () => {
      const {balances} = walletBalanceStore;
      walletBalanceStore.updateFromServer({Id: '1', Name: 'w1'});

      expect(balances.length).toEqual(1);

      walletBalanceStore.updateFromServer({Id: '2', Name: 'w2'});

      expect(balances.length).toEqual(2);
    });

    it('should not create a new wallet if update wallet from server', () => {
      const {balances} = walletBalanceStore;
      const wallet = walletBalanceStore.updateFromServer({Id: '1', Name: 'w1'});

      expect(balances.length).toEqual(1);

      walletBalanceStore.updateFromServer({Id: wallet.id, Name: 'w2'});

      expect(balances.length).toEqual(1);
      expect(balances[0].title).toEqual('w2');
    });
  });
});
