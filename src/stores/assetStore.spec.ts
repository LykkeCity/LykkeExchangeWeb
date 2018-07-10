import {AssetStore, RootStore} from '.';
import {AssetCategoryModel, AssetModel, InstrumentModel} from '../models';

describe('asset store', () => {
  const getApiMock = () => {
    return {
      fetchAssetInstruments: jest.fn(() => ({AssetPairs: [assetPairMock]})),
      fetchAssets: jest.fn(() => ({Assets: [assetMock]})),
      fetchAvailableAssets: jest.fn(() => ({
        AssetIds: [USDAsset.id, EURAsset.id, LKKAsset.id]
      })),
      fetchCategories: jest.fn(() => ({AssetCategories: [categoryMock]})),
      fetchDescription: jest.fn(() => ({
        Descriptions: [USDAsset.id, EURAsset.id, LKKAsset.id]
      })),
      fetchPaymentMethods: jest.fn(() => ({
        PaymentMethods: [paymentMethodMock]
      })),
      fetchRates: jest.fn(() => [rateMock, incorrectRateMock])
    };
  };

  let assetStore: AssetStore;
  let selectedAsset: string;

  const root = new RootStore();
  const mockApi = getApiMock();
  const categoryMock = new AssetCategoryModel();
  const assetMock = {
    Accuracy: 2,
    CategoryId: 'Category',
    DisplayId: 'USD display',
    IconUrl: '',
    Id: 'USD',
    IsBase: true,
    Name: 'USD'
  };
  const assetPairMock = {
    Accuracy: 2,
    BaseAssetId: 'USD',
    Id: 'USDETC',
    InvertedAccuracy: 2,
    Name: 'USD/ETC',
    QuotingAssetId: 'ETC'
  };
  const USDAsset = new AssetModel({id: 'USD', isBase: true});
  const EURAsset = new AssetModel({id: 'EUR', isBase: true});
  const ETCAsset = new AssetModel({id: 'ETC', isBase: false});
  const LKKAsset = new AssetModel({id: 'LKK', isBase: true});
  const USDETCInstrument = new InstrumentModel({
    baseAsset: USDAsset,
    id: 'USDETC',
    quoteAsset: ETCAsset
  });
  const USDLKKInstrument = new InstrumentModel({
    baseAsset: USDAsset,
    id: 'USDLKK',
    quoteAsset: LKKAsset
  });
  const EURETCInstrument = new InstrumentModel({
    baseAsset: EURAsset,
    id: 'EURETC',
    quoteAsset: ETCAsset
  });
  const EURLKKInstrument = new InstrumentModel({
    baseAsset: EURAsset,
    id: 'EURLKK',
    quoteAsset: LKKAsset
  });
  const ETCUSDInstrument = new InstrumentModel({
    baseAsset: ETCAsset,
    id: 'ETCUSD',
    quoteAsset: USDAsset
  });
  const LKKUSDInstrument = new InstrumentModel({
    baseAsset: LKKAsset,
    id: 'LKKUSD',
    quoteAsset: USDAsset
  });
  const ETCEURInstrument = new InstrumentModel({
    baseAsset: ETCAsset,
    id: 'ETCEUR',
    quoteAsset: EURAsset
  });
  const LKKEURInstrument = new InstrumentModel({
    baseAsset: LKKAsset,
    id: 'LKKEUR',
    quoteAsset: EURAsset
  });
  const rateMock = {
    Ask: 1,
    AssetPair: USDETCInstrument.id,
    Bid: 1
  };
  const incorrectRateMock = {
    Ask: 1,
    AssetPair: 'Test',
    Bid: 1
  };
  const paymentMethodMock = {
    Assets: [USDAsset.id],
    Available: true,
    Name: 'Fxpaygate'
  };

  beforeEach(() => {
    assetStore = new AssetStore(root, mockApi);
    assetStore.instruments = [];
  });

  it('should hold strongly typed ref to the root store', () => {
    expect(assetStore).toHaveProperty('rootStore');
    expect(assetStore.rootStore).toBeDefined();
    expect(assetStore.rootStore).toBeInstanceOf(RootStore);
  });

  describe('getter baseAssets', () => {
    beforeEach(() => {
      assetStore.assets = [USDAsset, EURAsset, ETCAsset, LKKAsset];
    });

    it('should return empty array if no assets available', () => {
      expect(assetStore.baseAssets).toHaveLength(0);
    });

    it('should return available base assets', async () => {
      await assetStore.fetchAvailableAssets().then(() => {
        expect(assetStore.baseAssets).toHaveLength(3);
      });
    });
  });

  describe('method getById', () => {
    beforeEach(() => {
      assetStore.assets = [USDAsset, EURAsset, LKKAsset];
    });

    it('should return asset found by id', () => {
      expect(assetStore.getById(USDAsset.id)).toBe(USDAsset);
    });

    it('should return null if asset not found', () => {
      expect(assetStore.getInstrumentById('Test')).toBeUndefined();
    });
  });

  describe('method getInstrumentById', () => {
    beforeEach(() => {
      assetStore.instruments = [
        USDETCInstrument,
        USDLKKInstrument,
        EURETCInstrument,
        EURLKKInstrument,
        ETCUSDInstrument,
        LKKUSDInstrument,
        ETCEURInstrument,
        LKKEURInstrument
      ];
    });

    it('should return instrument found by id', () => {
      expect(assetStore.getInstrumentById(USDETCInstrument.id)).toBe(
        USDETCInstrument
      );
    });

    it('should return null if instrument not found', () => {
      expect(assetStore.getInstrumentById('TestTest')).toBeUndefined();
    });
  });

  describe('method getInstrumentsForSelectedAsset', () => {
    beforeEach(() => {
      selectedAsset = 'USD';

      assetStore.instruments = [
        USDETCInstrument,
        USDLKKInstrument,
        EURETCInstrument,
        EURLKKInstrument,
        ETCUSDInstrument,
        LKKUSDInstrument,
        ETCEURInstrument,
        LKKEURInstrument
      ];
    });

    it('should return empty array if no istruments available', () => {
      assetStore.instruments = [];

      expect(
        assetStore.getInstrumentsForSelectedAsset(selectedAsset)
      ).toHaveLength(0);
    });

    it('should return istruments with base asset or quote asset that equals to selected asset', () => {
      expect(
        assetStore.getInstrumentsForSelectedAsset(selectedAsset)
      ).toHaveLength(4);
    });
  });

  describe('method fetchAssets', async () => {
    beforeEach(() => {
      assetStore.categories = [{Id: 'Category'}, {Id: 'SecondCategory'}];
      assetStore.fetchCategories = jest.fn();
      assetStore.fetchAvailableAssets = jest.fn();
    });

    it('should call API methods to get assets', async () => {
      await assetStore.fetchAssets();

      expect(assetStore.fetchCategories).toHaveBeenCalled();
      expect(assetStore.fetchAvailableAssets).toHaveBeenCalled();
      expect(mockApi.fetchAssets).toHaveBeenCalled();
      expect(mockApi.fetchDescription).toHaveBeenCalled();
    });

    it('should fill assets from service', async () => {
      await assetStore.fetchAssets();
      expect(assetStore.assets).toHaveLength(1);
    });

    it('should set default category if it is not presented in store', async () => {
      assetStore.categories = [];

      await assetStore.fetchAssets();
      expect(assetStore.assets[0].category.id).toBeUndefined();
      expect(assetStore.assets[0].category.name).toBe('Other');
      expect(assetStore.assets[0].category.sortOrder).toBe(
        Number.MAX_SAFE_INTEGER
      );
    });

    it('should set default description if no descriptions available', async () => {
      mockApi.fetchDescription.mockReturnValue({Descriptions: []});

      await assetStore.fetchAssets();
      expect(assetStore.assets[0].description).toBe('No description');
    });
  });

  describe('method fetchAvailableAssets', async () => {
    it('should call API method to get assets', async () => {
      await assetStore.fetchAvailableAssets();
      expect(mockApi.fetchAvailableAssets).toHaveBeenCalled();
    });
  });

  describe('method fetchAssetsAvailableForDeposit', async () => {
    beforeEach(() => {
      assetStore.assets = [USDAsset, EURAsset, LKKAsset];
    });

    it('should call API method to get assets', async () => {
      await assetStore.fetchAssetsAvailableForDeposit();
      expect(mockApi.fetchPaymentMethods).toHaveBeenCalled();
    });

    it('should fill instruments property by data from server', async () => {
      await assetStore.fetchAssetsAvailableForDeposit();
      expect(assetStore.assetsAvailableForDeposit).toHaveLength(1);
      expect(assetStore.assetsAvailableForDeposit[0]).toBe(USDAsset);
    });

    it('should not fill instruments if payment method is not Fxpaygate', async () => {
      paymentMethodMock.Name = 'Cash';

      await assetStore.fetchAssetsAvailableForDeposit();
      expect(assetStore.assetsAvailableForDeposit).toHaveLength(0);
    });

    it('should not fill instruments if Fxpaygate payment method is not available', async () => {
      paymentMethodMock.Available = false;

      await assetStore.fetchAssetsAvailableForDeposit();
      expect(assetStore.assetsAvailableForDeposit).toHaveLength(0);
    });
  });

  describe('method fetchInstruments', async () => {
    it('should call API method to get instruments', async () => {
      await assetStore.fetchInstruments();
      expect(mockApi.fetchAssetInstruments).toHaveBeenCalled();
    });

    it('should fill instruments property by data from server', async () => {
      await assetStore.fetchInstruments();
      expect(assetStore.instruments).toHaveLength(1);
    });
  });

  describe('method fetchRates', async () => {
    beforeEach(() => {
      assetStore.instruments = [
        USDETCInstrument,
        USDLKKInstrument,
        EURETCInstrument
      ];
    });

    it('should call API method to get rates', async () => {
      await assetStore.fetchRates();
      expect(mockApi.fetchRates).toHaveBeenCalled();
    });

    it('should filter instruments by rates from server', async () => {
      await assetStore.fetchRates();
      expect(assetStore.instruments).toHaveLength(1);
    });
  });

  describe('method fetchCategories', async () => {
    it('should call API method to get categories', async () => {
      await assetStore.fetchCategories();
      expect(mockApi.fetchCategories).toHaveBeenCalled();
    });

    it('should fill categories property by data from server', async () => {
      await assetStore.fetchCategories();
      expect(assetStore.categories).toHaveLength(1);
      expect(assetStore.categories[0]).toBe(categoryMock);
    });
  });
});
