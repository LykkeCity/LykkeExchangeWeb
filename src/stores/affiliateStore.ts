import {action, computed, observable} from 'mobx';
import {RootStore} from '.';
import {ROUTE_AFFILIATE_STATISTICS} from '../constants/routes';
import {StorageUtils} from '../utils';

const AGREE_KEY = 'lw-affiliate-agree';

const agreeStorage = StorageUtils.withKey(AGREE_KEY);

export class AffiliateStore {
  readonly rootStore: RootStore;
  @observable checkAgreement: boolean;

  constructor(rootScore: RootStore) {
    this.rootStore = rootScore;
    this.checkAgreement = true;
  }

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
}

export default AffiliateStore;
