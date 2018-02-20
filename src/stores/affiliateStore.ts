import {action, computed, observable, runInAction} from 'mobx';
import {RootStore} from '.';
import {AffiliateApi} from '../api/affiliateApi';
import {AffiliateModel} from '../models';
import {StorageUtils} from '../utils';

const AGREE_KEY = 'lw-affiliate-agree';

const agreeStorage = StorageUtils.withKey(AGREE_KEY);

export class AffiliateStore {
  @observable checkAgreement: boolean = true;
  @observable affiliateModel: AffiliateModel;
  @observable isAgreed: boolean = !!agreeStorage.get();
  isLoaded: boolean = false;

  constructor(readonly rootScore: RootStore, private api: AffiliateApi) {
    // TODO: rework to API
    // const dto = {affiliateLink: 'https://www.lykke.com/?ref=dustin34ie8'};
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

  copyLinkToClipboard = () => {
    const ta = document.createElement('textarea');
    ta.innerText = this.affiliateModel.affiliateLink;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  };

  private getLink = async () => {
    const resp = await this.api.fetchLink();
    if (resp) {
      runInAction(() => this.udpateAffiliateModel(resp));
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
