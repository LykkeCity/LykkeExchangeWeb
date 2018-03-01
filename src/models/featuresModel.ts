import {observable} from 'mobx';

export class FeaturesModel {
  @observable AffiliateEnabled: boolean = false;

  updateFromDto(dto: Partial<FeaturesModel>) {
    Object.assign(this, dto);
  }
}

export default FeaturesModel;
