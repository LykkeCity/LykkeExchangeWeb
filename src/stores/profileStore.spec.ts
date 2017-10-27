import {ProfileStore, RootStore} from '.';

const rootStore = new RootStore();
rootStore.authStore.isAuthenticated = jest.fn();
const mockApi = {
  fetchBaseCurrency: jest.fn(),
  getUserName: jest.fn(),
  updateBaseCurrency: jest.fn()
};
const profileStore = new ProfileStore(rootStore, mockApi);

describe('profile store', () => {
  it('should react on base currency change', () => {
    const newBaseCurrency = '-' + profileStore.baseCurrency;
    profileStore.baseCurrency = newBaseCurrency;

    expect(mockApi.updateBaseCurrency).toBeCalled();
    expect(mockApi.updateBaseCurrency).toBeCalledWith(newBaseCurrency);
  });

  it('first name should check if user is authenticated', () => {
    profileStore.fetchFirstName();

    expect(rootStore.authStore.isAuthenticated).toBeCalled();
  });
});
