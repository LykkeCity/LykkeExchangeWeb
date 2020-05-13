import {observable} from 'mobx';

export class TransferFormModel {
  @observable is2FaValid: boolean = true;
  @observable code2FaError: string;
  @observable submitting: boolean;
}

export default TransferFormModel;
