import {ProfileStore, RootStore} from '.';

const rootStore = new RootStore();
const mockApi = {
  fetchBaseAsset: jest.fn(),
  getUserName: jest.fn(),
  updateBaseAsset: jest.fn()
};
const profileStore = new ProfileStore(rootStore, mockApi);

describe('profile store', () => {
  it('should react on base currency change', () => {
    const newBaseCurrency = '-' + profileStore.baseAsset;
    profileStore.baseAsset = newBaseCurrency;

    expect(mockApi.updateBaseAsset).toBeCalled();
    expect(mockApi.updateBaseAsset).toBeCalledWith(newBaseCurrency);
  });
});
