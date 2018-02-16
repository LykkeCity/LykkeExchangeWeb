import {action, computed, observable} from 'mobx';
import {RootStore} from '.';
import {ROUTE_AFFILIATE_STATISTICS} from '../constants/routes';
import {AffiliateModel} from '../models/affiliateModel';
import {StorageUtils} from '../utils';

const AGREE_KEY = 'lw-affiliate-agree';

const agreeStorage = StorageUtils.withKey(AGREE_KEY);

export class AffiliateStore {
  @observable checkAgreement: boolean = true;
  @observable affiliateModel: AffiliateModel;

  constructor(readonly rootScore: RootStore) {
    // TODO: rework to API
    const dto = {affiliateLink: 'https://www.lykke.com/?ref=dustin34ie8'};
    this.affiliateModel = this.createAffiliateModel(dto);
  }

  createAffiliateModel = (dto?: any) => new AffiliateModel(dto);

  onAgreeClicked = () => {
    agreeStorage.set(true);
    const host = `//${location.hostname}:${location.port}`;
    location.replace(`${host}${ROUTE_AFFILIATE_STATISTICS}`);
  };

  @computed
  get isAgreed() {
    return !!agreeStorage.get();
  }

  @computed
  get isCheckedAgreement() {
    return this.checkAgreement;
  }

  @action
  handleChangeCheckedAgreement = () => {
    this.checkAgreement = !this.checkAgreement;
  };

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
