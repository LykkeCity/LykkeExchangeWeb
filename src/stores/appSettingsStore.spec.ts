import {AppSettingsStore, RootStore} from '.';

const rootStore = new RootStore();
const mockApi = {
  fetchCountryCodes: jest.fn(() => ({
    Result: {
      CountriesList: [
        {
          Id: 'FOO',
          Name: 'Foo country'
        },
        {
          Id: 'FOO',
          Name: 'Foo country'
        },
        {
          Id: 'BAR',
          Name: 'Bar country'
        }
      ]
    }
  })),
  fetchSettings: jest.fn()
};
const appSettingsStore = new AppSettingsStore(rootStore, mockApi);

describe('app settings store', () => {
  it('should hold strongly typed ref to the root store', () => {
    expect(appSettingsStore).toHaveProperty('rootStore');
    expect(appSettingsStore.rootStore).toBeDefined();
    expect(appSettingsStore.rootStore).toBeInstanceOf(RootStore);
  });

  it('should provide countries list', async () => {
    await appSettingsStore.fetchCountryCodes();
    expect(appSettingsStore.countries.length).toBeGreaterThan(0);
  });

  it('should filter out duplicated countries', async () => {
    await appSettingsStore.fetchCountryCodes();
    expect(appSettingsStore.countries.length).toBe(2);
  });
});
