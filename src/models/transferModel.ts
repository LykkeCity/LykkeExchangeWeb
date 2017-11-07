import {action, computed, observable, reaction} from 'mobx';
import * as uuid from 'uuid';
import {WalletModel} from '.';
import {TransferStore} from '../stores';

export class TransferModel {
  id = uuid.v4();
  @observable from: WalletModel;
  @observable to: WalletModel;
  @observable amount: number = 0;
  @observable asset: string = '';

  @observable amountInBaseCurrency: number;

  @computed
  get asJson() {
    return {
      Amount: this.amount,
      AssetId: this.asset,
      WalletId: this.to.id
    };
  }

  @computed
  get asBase64() {
    return btoa(JSON.stringify({Id: this.id}));
  }

  @computed
  get canTransfer() {
    return !!this.from && !!this.to && !!this.amount && !!this.asset;
  }

  constructor(private store: TransferStore) {
    this.store = store;
    reaction(
      () => this.amount + this.asset,
      async () => {
        if (!!this.amount && !!this.asset) {
          const resp = await this.store.convertToBaseCurrency(
            this,
            this.store.rootStore.profileStore.baseAsset
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

  @action
  setAmount = (amount: number) => {
    this.amount = amount;
  };

  @action
  setAsset = (assetId: string) => {
    this.asset = assetId;
  };

  sendTransfer = async () => {
    if (this.canTransfer) {
      await this.store.startTransfer(this);
    }
  };
}

export default TransferModel;
