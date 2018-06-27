export class DialogModel {
  id: string;
  type: string;
  header: string;
  text: string;

  constructor(transaction?: Partial<DialogModel>) {
    Object.assign(this, transaction);
  }
}

export default DialogModel;
