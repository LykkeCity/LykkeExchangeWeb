import {computed, observable, runInAction} from 'mobx';
import {AssetApi} from '../api/assetApi';
import {AssetModel, InstrumentModel} from '../models/index';
import {RootStore} from './index';

const AddressError = {
  NotGenerated: 'BlockchainWalletDepositAddressNotGenerated'
};

export class AssetStore {
  @observable assets: AssetModel[] = [];
  @observable assetsAvailableForCreditCardDeposit: AssetModel[] = [];
  @observable assetsAvailableForSwiftDeposit: AssetModel[] = [];
  @observable assetsAvailableForCryptoDeposit: AssetModel[] = [];
  @observable categories: any[] = [];
  @observable instruments: InstrumentModel[] = [];
  @observable selectedAsset?: AssetModel;

  @observable.shallow private availableAssets: string[] = [];

  @computed
  get baseAssets() {
    return this.assets
      .filter(a => this.availableAssets.indexOf(a.id) > -1)
      .filter(x => x.isBase);
  }

  constructor(readonly rootStore: RootStore, private api: AssetApi) {}

  getById = (id: string) => this.assets.find(a => a.id === id);

  isEth = (assetId: string) => {
    const asset = this.getById(assetId);

    return assetId === 'ETH' || (asset && asset.name === 'ETH');
  };

  getInstrumentById = (id: string) =>
    this.instruments.find(x => x.id.toLowerCase() === id.toLowerCase());

  fetchAssets = async () => {
    await this.fetchCategories();
    await this.fetchAvailableAssets();
    const resp = await this.api.fetchAssets();
    const descriptionsResp = await this.api.fetchDescription();
    runInAction(() => {
      this.assets = resp.Assets.map(
        ({
          Id: id,
          Name,
          DisplayId: name,
          CategoryId,
          Accuracy: accuracy,
          IconUrl: iconUrl,
          IsBase
        }: any) => {
          const category = this.categories.find(x => x.Id === CategoryId) || {
            Name: 'Other',
            SortOrder: Number.MAX_SAFE_INTEGER
          };
          const description = descriptionsResp.Descriptions.find(
            (d: any) => d.Id === id
          ) || {
            Description: 'No description'
          };
          const asset = new AssetModel({
            accuracy,
            category: {
              id: category.Id,
              name: category.Name,
              sortOrder: category.SortOrder
            },
            description: description.Description,
            iconUrl,
            id,
            name: name || Name
          });
          asset.isBase = IsBase;
          return asset;
        }
      );
    });
  };

  fetchAvailableAssets = async () => {
    const resp = await this.api.fetchAvailableAssets();
    runInAction(() => {
      this.availableAssets = resp.AssetIds;
    });
  };

  fetchAssetsAvailableForDeposit = async () => {
    const resp = await this.api.fetchPaymentMethods();
    const fxpaygate = resp.PaymentMethods.find(
      (paymentMethod: any) => paymentMethod.Name === 'Fxpaygate'
    );
    const swift = resp.PaymentMethods.find(
      (paymentMethod: any) => paymentMethod.Name === 'Swift'
    );
    const cryptos = resp.PaymentMethods.find(
      (paymentMethod: any) => paymentMethod.Name === 'Cryptos'
    );
    const prepareAssets = (assets: any) =>
      assets
        .map((assetId: string) => this.getById(assetId))
        .filter((asset: any) => asset)
        .sort((a1: AssetModel, a2: AssetModel) =>
          a1.name.localeCompare(a2.name)
        );

    if (fxpaygate && fxpaygate.Available) {
      runInAction(() => {
        this.assetsAvailableForCreditCardDeposit = prepareAssets(
          fxpaygate.Assets
        );
      });
    }
    if (swift && swift.Available) {
      runInAction(() => {
        this.assetsAvailableForSwiftDeposit = prepareAssets(swift.Assets);
      });
    }
    if (cryptos && cryptos.Available) {
      runInAction(() => {
        this.assetsAvailableForCryptoDeposit = prepareAssets(cryptos.Assets);
      });
    }
  };

  fetchAddress = async (assetId: string) => {
    await this.api
      .fetchAssetAddress(assetId)
      .then((resp: any) => {
        this.setAddress(assetId, resp);
      })
      .catch(async (error: any) => {
        const errorMessage = JSON.parse(error.message);
        if (errorMessage && errorMessage.error === AddressError.NotGenerated) {
          try {
            await this.api.generateAssetAddress(assetId);
          } finally {
            const resp = await this.api.fetchAssetAddress(assetId);
            this.setAddress(assetId, resp);
          }
        }
      });
  };

  fetchInstruments = async () => {
    const resp = await this.api.fetchAssetInstruments();
    runInAction(() => {
      this.instruments = resp.AssetPairs
        .map(
          (ap: any) =>
            new InstrumentModel({
              accuracy: ap.Accuracy,
              baseAsset: this.getById(ap.BaseAssetId),
              id: ap.Id,
              invertedAccuracy: ap.InvertedAccuracy,
              name: ap.Name,
              quoteAsset: this.getById(ap.QuotingAssetId)
            })
        )
        .filter(
          (instrument: InstrumentModel, key: number, arr: InstrumentModel[]) =>
            arr.find(
              obj =>
                obj.baseAsset === instrument.baseAsset &&
                obj.quoteAsset === instrument.quoteAsset
            ) === instrument
        );
    });
  };

  fetchRates = async () => {
    const resp = await this.api.fetchRates();

    resp.forEach(({AssetPair, Bid, Ask}: any) => {
      const instrument = this.getInstrumentById(AssetPair);
      if (instrument) {
        instrument.ask = Ask;
        instrument.bid = Bid;
      }
    });

    this.instruments = this.instruments.filter(
      instrument => instrument.bid || instrument.ask
    );
  };

  fetchCategories = async () => {
    const resp = await this.api.fetchCategories();
    runInAction(() => {
      this.categories = resp.AssetCategories;
    });
  };

  private setAddress = (assetId: string, resp: any) => {
    const asset = this.getById(assetId);
    if (asset) {
      asset.address = resp.Address;
      asset.addressBase = resp.BaseAddress;
      asset.addressExtension = resp.AddressExtension;
    }
  };
}
