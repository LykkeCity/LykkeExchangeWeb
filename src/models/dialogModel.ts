import {computed, observable} from 'mobx';

export enum DialogConditionType {
  Pretrade,
  Predeposit
}

export enum DialogActionType {
  Submit,
  Checkbox
}

export class DialogActionModel {
  id: string;
  type: DialogActionType;
  text: string;
  @observable done: boolean;
}

// tslint:disable-next-line:max-classes-per-file
export class DialogModel {
  id: string;
  conditionType?: DialogConditionType;
  header: string;
  text: string;
  @observable actions: DialogActionModel[];
  @observable visible: boolean;

  @computed
  get isConfirmed() {
    return this.actions
      .filter(
        (action: DialogActionModel) => action.type === DialogActionType.Checkbox
      )
      .every((action: DialogActionModel) => !!action.done);
  }

  constructor(transaction?: Partial<DialogModel>) {
    Object.assign(this, transaction);
  }
}

export default DialogModel;
