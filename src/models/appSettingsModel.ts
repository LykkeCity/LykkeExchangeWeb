import {observable} from 'mobx';

export class AppSettingsModel {
  @observable
  feeSettings: {
    bankCardsFeeSizePercentage: number;
  };
  @observable countryCodes: any[] = [];

  constructor() {
    this.feeSettings = {bankCardsFeeSizePercentage: 0};
  }
}
