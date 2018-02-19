import {action, computed, observable} from 'mobx';
import {RootStore} from '.';
import {AffiliateModel} from '../models/affiliateModel';
import {StorageUtils} from '../utils';

const AGREE_KEY = 'lw-affiliate-agree';

const agreeStorage = StorageUtils.withKey(AGREE_KEY);

export class AffiliateStore {
  @observable checkAgreement: boolean = true;
  @observable affiliateModel: AffiliateModel;
  @observable isAgreed: boolean = !!agreeStorage.get();

  constructor(readonly rootScore: RootStore) {
    // TODO: rework to API
    const dto = {affiliateLink: 'https://www.lykke.com/?ref=dustin34ie8'};
    this.affiliateModel = this.createAffiliateModel(dto);
  }

  createAffiliateModel = (dto?: any) => new AffiliateModel(dto);

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
}

export default AffiliateStore;
