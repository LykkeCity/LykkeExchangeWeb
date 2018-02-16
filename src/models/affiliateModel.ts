import {observable} from 'mobx';

export class AffiliateModel {
  @observable affiliateLink: string;

  constructor(dto?: any) {
    if (!!dto) {
      this.affiliateLink = dto.affiliateLink;
    }
  }
}

export default AffiliateModel;
