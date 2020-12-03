import {observable} from 'mobx';

export class LkkInvestmentModel {
  @observable amount: number = 0;
  isBankTransfer: boolean;

  constructor(lkkInvestment?: Partial<LkkInvestmentModel>) {
    Object.assign(this, lkkInvestment);
  }
}

export default LkkInvestmentModel;
