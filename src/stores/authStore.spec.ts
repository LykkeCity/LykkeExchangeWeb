import {AuthStore, RootStore} from '.';
import {MockAuthApi} from '../api/mocks/authApi';
import {UserModel} from '../models';

const root = new RootStore();
const authStore = new AuthStore(root, new MockAuthApi());

describe('auth store', () => {
  it('should hold strongly typed ref to the root store', () => {
    expect(authStore).toHaveProperty('rootStore');
    expect(authStore.rootStore).toBeDefined();
    expect(authStore.rootStore).toBeInstanceOf(RootStore);
  });

  it('should provide sign in method', () => {
    expect(authStore.signIn).toBeDefined();
  });

  test('sign in should return user or null', () => {
    const sut = jest.fn(authStore.signIn);
    const result = sut.call({
      email: 'foo@bar.com',
      password: 'bar'
    });

    expect(result).resolves.toBeInstanceOf(UserModel);
  });
});
