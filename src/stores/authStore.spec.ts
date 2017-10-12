import {AuthStore, RootStore} from '.';
import {MockAuthApi} from '../api/mocks/authApi';

const root = new RootStore();
const authStore = new AuthStore(root, new MockAuthApi());

describe('auth store', () => {
  it('should hold strongly typed ref to the root store', () => {
    expect(authStore).toHaveProperty('rootStore');
    expect(authStore.rootStore).toBeDefined();
    expect(authStore.rootStore).toBeInstanceOf(RootStore);
  });

  it('should provide get token method', () => {
    expect(authStore.getToken).toBeDefined();
  });
});
