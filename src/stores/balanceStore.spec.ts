import {BalanceStore} from '.';

const balanceStore = new BalanceStore();

describe('wallet store', () => {
  describe('updateFromServer', () => {
    it('should be defined', () => {
      expect(balanceStore.updateFromServer).toBeDefined();
    });

    it('should create a new wallet', () => {
      const wallet = balanceStore.updateFromServer({AssetId: 'a1'});
      expect(wallet).toBeDefined();
      expect(wallet.assetId).toBe('a1');
    });
  });
});
