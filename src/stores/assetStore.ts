import {computed, observable, runInAction} from 'mobx';
import {AssetApi} from '../api/assetApi';
import {AssetModel, InstrumentModel} from '../models/index';
import {RootStore} from './index';

const AddressError = {
  NotGenerated: [
    'AddressNotGenerated',
    'BlockchainWalletDepositAddressNotGenerated'
  ]
};

export class AssetStore {
  @observable assets: AssetModel[] = [];
  @observable assetsAvailableForCreditCardDeposit: AssetModel[] = [];
  @observable assetsAvailableForSwiftDeposit: AssetModel[] = [];
  @observable assetsAvailableForCryptoDeposit: AssetModel[] = [];
  @observable assetsAvailableForSwiftWithdraw: AssetModel[] = [];
  @observable assetsAvailableForCryptoWithdraw: AssetModel[] = [];
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

  getInstrumentById = (id: string) =>
    this.instruments.find(x => x.id.toLowerCase() === id.toLowerCase());

  fetchAssets = async () => {
    await this.fetchCategories();
    await this.fetchAvailableAssets();
    const resp = await this.api.fetchAssets();
    runInAction(() => {
      this.assets = resp.Assets.map(
        ({
          BlockchainNetworkName: blockchainNetworkName,
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
          const asset = new AssetModel({
            accuracy,
            blockchainNetworkName,
            category: {
              id: category.Id,
              name: category.Name,
              sortOrder: category.SortOrder
            },
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
    const link4pay = resp.PaymentMethods.find(
      (paymentMethod: any) => paymentMethod.Name === 'Link4Pay'
    );
    const swift = resp.PaymentMethods.find(
      (paymentMethod: any) => paymentMethod.Name === 'Swift'
    );
    const cryptos = resp.PaymentMethods.find(
      (paymentMethod: any) => paymentMethod.Name === 'Cryptos'
    );

    if (link4pay && link4pay.Available) {
      runInAction(() => {
        this.assetsAvailableForCreditCardDeposit = this.prepareAssets(
          link4pay.Assets
        );
      });
    }
    if (swift && swift.Available) {
      runInAction(() => {
        this.assetsAvailableForSwiftDeposit = this.prepareAssets(swift.Assets);
      });
    }
    if (cryptos && cryptos.Available) {
      runInAction(() => {
        this.assetsAvailableForCryptoDeposit = this.prepareAssets(
          cryptos.Assets
        );
      });
    }
  };

  fetchAssetsAvailableForWithdraw = async () => {
    const resp = await this.api.fetchWithdrawMethods();
    const cryptos = resp.WithdrawalMethods.find(
      (paymentMethod: any) => paymentMethod.Name === 'Cryptos'
    );
    const swift = resp.WithdrawalMethods.find(
      (paymentMethod: any) => paymentMethod.Name === 'Swift'
    );

    if (cryptos && cryptos.Assets) {
      runInAction(() => {
        this.assetsAvailableForCryptoWithdraw = this.prepareAssets(
          cryptos.Assets
        );
      });
    }

    if (swift && swift.Assets) {
      runInAction(() => {
        this.assetsAvailableForSwiftWithdraw = this.prepareAssets(swift.Assets);
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
        if (
          errorMessage &&
          AddressError.NotGenerated.indexOf(errorMessage.error) > -1
        ) {
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
      this.instruments = resp.AssetPairs.map(
        (ap: any) =>
          new InstrumentModel({
            accuracy: ap.Accuracy,
            baseAsset: this.getById(ap.BaseAssetId),
            id: ap.Id,
            invertedAccuracy: ap.InvertedAccuracy,
            name: ap.Name,
            quoteAsset: this.getById(ap.QuotingAssetId)
          })
      ).filter(
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

  private prepareAssets = (assets: any) =>
    assets
      .map((assetId: string) => this.getById(assetId))
      .filter((asset: any) => asset)
      .sort((a1: AssetModel, a2: AssetModel) => a1.name.localeCompare(a2.name));
}
