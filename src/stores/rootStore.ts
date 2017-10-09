import {AuthApi} from '../api';
import {AuthStore} from './index';

export class RootStore {
  readonly authStore: AuthStore;

  constructor() {
    this.authStore = new AuthStore(this, new AuthApi());
  }
}

export default RootStore;
