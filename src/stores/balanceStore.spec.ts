import {BalanceStore, RootStore} from '.';
import {AssetModel} from '../models/index';

const rootStore = new RootStore();
const balanceStore = new BalanceStore(rootStore);
const {assetStore} = rootStore;
assetStore.getById = jest.fn((id: string) => new AssetModel({name: id}));

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
