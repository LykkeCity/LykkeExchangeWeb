import {CatalogsStore, RootStore} from '.';

const rootStore = new RootStore();
const mockApi = {
  fetchCountries: jest.fn(() => [
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
  ])
};
const catalogsStore = new CatalogsStore(rootStore, mockApi);

describe('catalogs store', () => {
  it('should hold strongly typed ref to the root store', () => {
    expect(catalogsStore).toHaveProperty('rootStore');
    expect(catalogsStore.rootStore).toBeDefined();
    expect(catalogsStore.rootStore).toBeInstanceOf(RootStore);
  });

  it('should provide countries list', async () => {
    await catalogsStore.fetchCountries();
    expect(catalogsStore.countries.length).toBeGreaterThan(0);
  });

  it('should filter out duplicated countries', async () => {
    await catalogsStore.fetchCountries();
    expect(catalogsStore.countries.length).toBe(2);
  });
});
