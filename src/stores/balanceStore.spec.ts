import {BalanceStore, RootStore} from '.';

const rootStore = new RootStore();
const balanceStore = new BalanceStore(rootStore);

describe('wallet store', () => {
  it('should hold strongly typed ref to the root store', () => {
    expect(balanceStore).toHaveProperty('rootStore');
    expect(balanceStore.rootStore).toBeDefined();
    expect(balanceStore.rootStore).toBeInstanceOf(RootStore);
  });
});
