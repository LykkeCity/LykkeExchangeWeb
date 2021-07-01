import {observable, runInAction} from 'mobx';
import {RootStore} from '.';
import {WhitelistingApi} from '../api/';
import WhitelistingModel from '../models/whitelistingModel';

export class WhitelistingStore {
  readonly rootStore: RootStore;

  @observable whitelistings: WhitelistingModel[];
  @observable isLoading: boolean = false;

  @observable isLoadingCreate: boolean = false;
  @observable isLoadingDelete: boolean = false;

  constructor(rootStore: RootStore, private api?: WhitelistingApi) {
    this.rootStore = rootStore;
  }

  createWhitelisting = async (
    name: string,
    addressBase: string,
    addressExtension: string,
    code2fa: string
  ) => {
    this.isLoadingCreate = true;
    try {
      return await this.api!.createWhitelisting(
        name,
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
      const whitelistings = await this.api!.fetchAll();
      runInAction(
        () =>
          (this.whitelistings = whitelistings.map(
            (dto: any) => new WhitelistingModel(dto)
          ))
      );
    } finally {
      runInAction(() => (this.isLoading = false));
    }
  };
}

export default WhitelistingStore;
