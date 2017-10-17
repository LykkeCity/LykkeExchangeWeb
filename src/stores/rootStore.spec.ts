import {AuthStore, BalanceStore, RootStore, UiStore, WalletStore} from './';

const rootStore = new RootStore();

describe('root store', () => {
  it('should hold strongly typed ref to auth store', () => {
    expect(rootStore).toHaveProperty('authStore');
    expect(rootStore.authStore).toBeDefined();
    expect(rootStore.authStore).toBeInstanceOf(AuthStore);
  });

  it('should hold strongly typed ref to wallet store', () => {
    expect(rootStore).toHaveProperty('walletStore');
    expect(rootStore.walletStore).toBeDefined();
    expect(rootStore.walletStore).toBeInstanceOf(WalletStore);
  });

  it('should hold strongly typed ref to balance store', () => {
    expect(rootStore).toHaveProperty('balanceStore');
    expect(rootStore.balanceStore).toBeDefined();
    expect(rootStore.balanceStore).toBeInstanceOf(BalanceStore);
  });

  it('should hold strongly typed ref to ui store', () => {
    expect(rootStore).toHaveProperty('uiStore');
    expect(rootStore.uiStore).toBeDefined();
    expect(rootStore.uiStore).toBeInstanceOf(UiStore);
  });
});
