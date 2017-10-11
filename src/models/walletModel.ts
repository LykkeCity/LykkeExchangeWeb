import {observable} from 'mobx';
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

  @observable collapsed: boolean;

  constructor(json?: any) {
    Object.assign(this, json);
    this.id = json.id || nextId();
  }

  toggleCollapse = () => (this.collapsed = !this.collapsed);
}

export default WalletModel;
