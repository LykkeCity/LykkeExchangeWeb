import {observable} from 'mobx';

export class AffiliateModel {
  @observable affiliateLink: string;
  @observable referralsCount: number;
  @observable totalTradeVolume: number;
  @observable totalBonus: number;

  constructor() {
    this.affiliateLink = '';
    this.referralsCount = 0;
    this.totalTradeVolume = 0;
    this.totalBonus = 0;
  }

  updateFromDto(dto: any) {
    if (!!dto) {
      if (!!dto.Url) {
        this.affiliateLink = dto.Url;
      }
      if (!!dto.ReferralsCount) {
        this.referralsCount = dto.ReferralsCount;
      }
      if (!!dto.TotalTradeVolume) {
        this.totalTradeVolume = dto.TotalTradeVolume;
      }
      if (!!dto.TotalBonus) {
        this.totalBonus = dto.TotalBonus;
      }
    }
  }
}

export default AffiliateModel;
