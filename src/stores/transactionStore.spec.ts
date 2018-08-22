import {when} from 'mobx';
import {RootStore, TransactionStore} from '.';
import {TransactionStatus, TransactionType, WalletModel} from '../models';

const rootStore = new RootStore();
const mockApi = {
  fetchExportCsvId: jest.fn(),
  fetchExportCsvUrl: jest.fn(),
  fetchWalletTransactions: jest.fn()
};
const transactionStore = new TransactionStore(rootStore, mockApi);
rootStore.walletStore.wallets.push(
  new WalletModel(rootStore.walletStore, {Id: 1, Type: 'Trading'})
);

describe('transaction store', () => {
  it('should hold strongly typed ref to the root store', () => {
    expect(transactionStore).toHaveProperty('rootStore');
    expect(transactionStore.rootStore).toBeDefined();
    expect(transactionStore.rootStore).toBeInstanceOf(RootStore);
  });

  it('should fetch asset transactions from API', async done => {
    mockApi.fetchWalletTransactions = jest.fn(() => {
      return [
        {
          Amount: 100,
          Asset: 'foo',
          DateTime: '2018-05-22T14:25:37.534Z',
          Id: 'bar',
          State: 'Finished',
          Type: 'Trade'
        }
      ];
    });
    await transactionStore.fetchAssetTransactions('1', 'foo', 0, 10);

    when(
      () => transactionStore.assetTransactions.length > 0,
      () => {
        expect(transactionStore.assetTransactions[0].amount).toBe(100);
        expect(transactionStore.assetTransactions[0].id).toBe('bar');
        expect(transactionStore.assetTransactions[0].state).toBe(
          TransactionStatus.Finished
        );
        expect(transactionStore.assetTransactions[0].type).toBe(
          TransactionType.Trade
        );
        done();
      }
    );
  });
});
