import {action, computed, observable, runInAction} from 'mobx';
import {RootStore} from '.';
import {AffiliateApi} from '../api/affiliateApi';
import {AffiliateModel} from '../models';
import {copyTextToClipboard, StorageUtils} from '../utils';

const AGREE_KEY = 'lw-affiliate-agree';

const agreeStorage = StorageUtils.withKey(AGREE_KEY);

export class AffiliateStore {
  @observable checkAgreement: boolean = true;
  @observable affiliateModel: AffiliateModel;
  @observable isAgreed: boolean = !!agreeStorage.get();
  isLoaded: boolean = false;

  constructor(readonly rootScore: RootStore, private api: AffiliateApi) {
    this.affiliateModel = new AffiliateModel();
  }

  getData = async () => {
    await this.getLink();
    if (!!this.affiliateModel.affiliateLink) {
      await this.getStats();
    } else {
      await this.createLink();
    }
    this.isLoaded = true;
  };

  udpateAffiliateModel = (dto?: any) => this.affiliateModel.updateFromDto(dto);

  @action
  onAgreeClicked = () => {
    agreeStorage.set(true);
    this.isAgreed = true;
  };

  @computed
  get isCheckedAgreement() {
    return this.checkAgreement;
  }

  @computed
  get isLoadData() {
    return (
      !this.isLoaded &&
      this.isAgreed &&
      this.rootScore.featureStore.hasAffiliate
    );
  }

  @computed
  get encodedAffiliateLink() {
    return encodeURIComponent(this.affiliateModel.affiliateLink);
  }

  copyLinkToClipboard = () => {
    copyTextToClipboard(this.affiliateModel.affiliateLink);
  };

  private getLink = async () => {
    const resp = await this.api.fetchLink();
    if (resp) {
      const dto = await resp.json();
      runInAction(() => this.udpateAffiliateModel(dto));
    }
  };

  private createLink = async () => {
    const resp = await this.api.createLink();
    runInAction(() => this.udpateAffiliateModel(resp));
  };

  private getStats = async () => {
    const resp = await this.api.fetchStats();
    runInAction(() => this.udpateAffiliateModel(resp));
  };
}

export default AffiliateStore;
