import {nextId} from '../utils/index';

export class WalletModel {
  id: string;
  title: string;
  desc: string;
  figures: {
    total: number;
    sent: number;
    received: number;
    pnl: number;
  };

  constructor(json?: any) {
    Object.assign(this, json);
    this.id = json.id || nextId();
  }
}

export default WalletModel;
