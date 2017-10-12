import {observable} from 'mobx';
import {nextId} from '../utils/index';

export class WalletModel {
  id: string;
  @observable title: string;
  @observable desc: string;

  @observable
  figures: {
    total: number;
    sent: number;
    received: number;
    pnl: number;
  } = {
    pnl: 0,
    received: 0,
    sent: 0,
    total: 0
  };

  @observable collapsed: boolean;

  constructor(json?: any) {
    this.id = json.Id || nextId();
    this.title = json.Name || 'Untitled';
    this.desc = json.Type;
  }

  toggleCollapse = () => (this.collapsed = !this.collapsed);
}

export default WalletModel;
