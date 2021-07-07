import {observable, runInAction} from 'mobx';
import {RootStore} from '.';
import {AssetApi, WalletApi, WhitelistingApi} from '../api/';
import CryptoOperationModel from '../models/cryptoOperationModel';
import {WalletDtoModel} from '../models/walletDtoModel';
import WhitelistingModel from '../models/whitelistingModel';

export class WhitelistingStore {
  readonly rootStore: RootStore;

  @observable whitelistings: WhitelistingModel[];
  @observable isLoading: boolean = false;
  @observable isLoaded: boolean = false;

  @observable cryptoOperations: CryptoOperationModel[];
  @observable isLoadingCryptoOperations: boolean = false;

  @observable wallets: WalletDtoModel[];
  @observable isLoadingWallets: boolean = false;

  @observable isLoadingCreate: boolean = false;
  @observable isLoadingDelete: boolean = false;

  constructor(
    rootStore: RootStore,
    private api?: WhitelistingApi,
    private assetApi?: AssetApi,
    private walletApi?: WalletApi
  ) {
    this.rootStore = rootStore;
  }

  createWhitelisting = async (
    name: string,
    assetId: string,
    addressBase: string,
    addressExtension: string,
    code2fa: string
  ) => {
    this.isLoadingCreate = true;
    try {
      return await this.api!.createWhitelisting(
        name,
        assetId,
        addressBase,
        addressExtension,
        code2fa
      );
    } finally {
      runInAction(() => (this.isLoadingCreate = false));
    }
  };

  deleteWhitelisting = async (id: string, code2fa: string) => {
    this.isLoadingDelete = true;
    try {
      return await this.api!.deleteWhitelisting(id, code2fa);
    } finally {
      runInAction(() => (this.isLoadingDelete = false));
    }
  };

  fetchAll = async () => {
    this.isLoading = true;
    try {
      const response = await this.api!.fetchAll();
      runInAction(
        () =>
          (this.whitelistings = response.map(
            (dto: any) => new WhitelistingModel(dto)
          ))
      );
    } finally {
      runInAction(() => {
        this.isLoading = false;
        this.isLoaded = true;
      });
    }
  };

  fetchCryptoOperations = async () => {
    this.isLoadingCryptoOperations = true;
    try {
      const response = await this.assetApi!.fetchAvailableCryptoOperations();
      runInAction(
        () =>
          (this.cryptoOperations = response.Assets.map(
            (dto: any) => new CryptoOperationModel(dto)
          ))
      );
    } finally {
      runInAction(() => (this.isLoadingCryptoOperations = false));
    }
  };

  fetchWallets = async () => {
    this.isLoadingWallets = true;
    try {
      const response = await this.walletApi!.fetchAll();
      runInAction(
        () =>
          (this.wallets = response.map((dto: any) => new WalletDtoModel(dto)))
      );
    } finally {
      runInAction(() => (this.isLoadingWallets = false));
    }
  };
}

export default WhitelistingStore;
