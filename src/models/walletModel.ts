import {nextId} from '../utils/index';

export class WalletModel {
  id: string;
  name: string;

  constructor(json?: any) {
    Object.assign(this, json);
    this.id = json.id || nextId();
  }
}

export default WalletModel;
