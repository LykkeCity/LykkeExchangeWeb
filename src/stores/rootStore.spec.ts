import {AuthStore, RootStore} from './';

const rootStore = new RootStore();

describe('root store', () => {
  it('should hold strongly typed ref to auth store', () => {
    expect(rootStore).toHaveProperty('authStore');
    expect(rootStore.authStore).toBeDefined();
    expect(rootStore.authStore).toBeInstanceOf(AuthStore);
  });
});
