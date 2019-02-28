import {ProfileStore, RootStore} from '.';

const rootStore = new RootStore();
const mockApi = {
  enable2fa: jest.fn(),
  fetchBaseAsset: jest.fn(),
  get2faCode: jest.fn(),
  get2faStatus: jest.fn(),
  getUserInfo: jest.fn(),
  sendSmsCode: jest.fn(),
  updateBaseAsset: jest.fn(),
  verifySmsCode: jest.fn()
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
