import {AssetModel, InstrumentModel} from '../models/index';
import MarketService from './marketService';

describe('market service', () => {
  const instruments = [
    new InstrumentModel({
      ask: 9600,
      baseAsset: new AssetModel({id: 'BTC'}),
      bid: 9500,
      id: 'BTCUSD',
      quoteAsset: new AssetModel({id: 'USD'})
    }),
    new InstrumentModel({
      ask: 58,
      baseAsset: new AssetModel({id: 'USD'}),
      bid: 55,
      id: 'USDRUB',
      quoteAsset: new AssetModel({id: 'RUB'})
    }),
    new InstrumentModel({
      ask: 0.06,
      baseAsset: new AssetModel({id: 'LKK'}),
      bid: 0.05,
      id: 'LKKUSD',
      quoteAsset: new AssetModel({id: 'USD'})
    })
  ];

  const assets = [
    new AssetModel({id: 'BTC'}),
    new AssetModel({id: 'USD'}),
    new AssetModel({id: 'RUB'}),
    new AssetModel({id: 'LKK'}),
    new AssetModel({id: 'TEST'})
  ];

  const find = (id: string) => instruments.find(x => x.id === id)!;

  beforeEach(() => {
    MarketService.init(instruments, assets);
  });

  describe('convert', () => {
    it('should return initial amount if no conversion needed', async () => {
      const result = MarketService.convert(1, 'BTC', 'BTC', find);
      expect(result).toBe(1);
    });

    it('should return zero if conversion cannot be executed (asset does not exist)', async () => {
      const result = MarketService.convert(1, 'BTC', 'FOO', find);
      expect(result).toBe(0);

      const result2 = MarketService.convert(1, 'FOO', 'BTC', find);
      expect(result2).toBe(0);
    });

    it('should return zero if conversion cannot be executed (no pair for conversion)', async () => {
      const result = MarketService.convert(1, 'BTC', 'TEST', find);
      expect(result).toBe(0);

      const result2 = MarketService.convert(1, 'TEST', 'BTC', find);
      expect(result2).toBe(0);
    });

    it('should be converted', async () => {
      const resultBtcUsd = MarketService.convert(1, 'BTC', 'USD', find);
      expect(resultBtcUsd).toBe(9500);

      const resultBtcRub = MarketService.convert(1.5, 'BTC', 'RUB', find);
      expect(resultBtcRub).toBe(1.5 * 9500 * 55);

      const resultLkkBtc = MarketService.convert(20000, 'LKK', 'BTC', find);
      expect(resultLkkBtc).toBe(20000 * 0.05 * (1 / 9600));

      const resultRubLkk = MarketService.convert(10000, 'RUB', 'LKK', find);
      expect(resultRubLkk).toBe(10000 * (1 / 58) * (1 / 0.06));
    });
  });
});
