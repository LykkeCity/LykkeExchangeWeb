import {BalanceModel, WalletModel} from '.';
import {WalletApi} from '../api/index';
import {RestWalletApi} from '../api/walletApi';
import {RootStore, WalletStore} from '../stores/index';

const wallet = new WalletModel({
  name: 'w1'
});

describe('wallet model', () => {
  it('should provide an id', () => {
    expect(wallet).toHaveProperty('id');
    expect(wallet.id).toBeDefined();
  });

  it('should pick an id from dto object if provided', () => {
    const w = new WalletModel({Id: 42, Name: 'wl'});
    expect(w.id).toBe(42);
  });

  test('total balance in base currency should be defined', () => {
    const w = new WalletModel({Id: 42, Name: 'w'});
    expect(w.totalBalanceInBaseCurrency).toBeDefined();
  });
});
