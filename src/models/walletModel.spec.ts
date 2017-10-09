import {WalletModel} from '.';

const wallet = new WalletModel({
  name: 'w1'
});

describe('wallet model', () => {
  it('should provide an id', () => {
    expect(wallet).toHaveProperty('id');
    expect(wallet.id).toBeDefined();
  });

  it('should pick an id from dto object if provided', () => {
    const w = new WalletModel({id: 42, name: 'wl'});
    expect(w.id).toBe(42);
  });
});
