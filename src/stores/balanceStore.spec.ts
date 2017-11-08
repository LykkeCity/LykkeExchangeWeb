import {BalanceStore, RootStore} from '.';

const rootStore = new RootStore();
const balanceStore = new BalanceStore(rootStore);

describe('wallet store', () => {
  it('should hold strongly typed ref to the root store', () => {
    expect(balanceStore).toHaveProperty('rootStore');
    expect(balanceStore.rootStore).toBeDefined();
    expect(balanceStore.rootStore).toBeInstanceOf(RootStore);
  });

  describe('updateFromServer', () => {
    it('should be defined', () => {
      expect(balanceStore.updateFromServer).toBeDefined();
    });

    it('should create a new wallet', () => {
      const {balances} = balanceStore;
      expect(balances.length).toEqual(0);

      const wallet = balanceStore.updateFromServer({AssetId: 'a1'});
      expect(balances.length).toEqual(0);
      expect(wallet).toBeDefined();
      expect(wallet.assetId).toBe('a1');
    });
  });
});
