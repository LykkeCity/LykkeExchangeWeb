import {action, computed, observable, reaction} from 'mobx';
import {WalletModel} from '.';
import {TransferStore} from '../stores';

export class TransferModel {
  @observable from: WalletModel;
  @observable to: WalletModel;
  @observable amount: number;
  @observable asset: string;

  @observable amountInBaseCurrency: number;

  @computed
  get asJson() {
    return JSON.stringify({
      AccountId: this.from.id,
      Amount: this.amount
    });
  }

  @computed
  get asBase64() {
    return !!this.from ? btoa(this.asJson) : '';
  }

  constructor(private store: TransferStore) {
    this.store = store;
    reaction(
      () => this.amount + this.asset,
      async () => {
        if (!!this.amount && !!this.asset) {
          const resp = await this.store.convertToBaseCurrency(
            this,
            this.store.rootStore.profileStore.baseCurrency
          );
          this.amountInBaseCurrency =
            resp.Converted[0] && resp.Converted[0].To.Amount;
        }
      }
    );
  }

  @action
  update = (transfer: Partial<TransferModel>) => Object.assign(this, transfer);

  @action
  setWallet = (wallet: WalletModel, dest: 'from' | 'to') => {
    this[dest] = wallet;
    if (dest === 'from' && wallet.hasBalances) {
      this.asset = wallet.balances[0].assetId;
    }
  };

  submit = async () => {
    // this.from.debit(this.amount);
    // this.to.credit(this.amount);
    await this.store.transfer(this);
  };
}

export default TransferModel;
