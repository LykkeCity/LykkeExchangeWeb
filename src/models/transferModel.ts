import {action, computed, observable, reaction} from 'mobx';
import * as uuid from 'uuid';
import {WalletModel} from '.';
import {TransferStore} from '../stores';

export class TransferModel {
  id = '';
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
      SourceWalletId: this.from.id,
      WalletId: this.to.id
    };
  }

  @computed
  get asBase64() {
    return btoa(JSON.stringify({Id: this.id}));
  }

  @computed
  get canTransfer() {
    return (
      !!this.from &&
      !!this.to &&
      !!this.amount &&
      !!this.asset &&
      this.hasEnoughAmount(this.amount)
    );
  }

  constructor(private store: TransferStore) {
    this.store = store;
    const {createWallet} = this.store.rootStore.walletStore;
    this.id = uuid.v4();
    this.from = createWallet();
    this.to = createWallet();

    reaction(
      () => this.amount + this.asset,
      async () => {
        if (!!this.amount && !!this.asset) {
          const resp = await this.store.convertToBaseCurrency(
            this,
            this.store.rootStore.profileStore.baseAsset
          );
          // FIXME: user input should be debounced instead of double-checked
          if (!!this.amount) {
            this.amountInBaseCurrency =
              resp.Converted[0] && resp.Converted[0].To.Amount;
          }
        } else {
          this.amountInBaseCurrency = 0;
        }
      }
    );
  }

  @action
  update = (transfer: Partial<TransferModel>) => Object.assign(this, transfer);

  @action
  setWallet = (wallet: WalletModel, dest: 'from' | 'to') => {
    if (dest === 'from') {
      this.from = wallet;
    } else {
      this.to = wallet;
    }
  };

  @action
  setAmount = (amount: number) => {
    this.amount = Number(amount);
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

  cancel = () => this.store.cancelTransfer(this);

  hasEnoughAmount = (amount: number) => {
    const transferrableBalance = this.from.balances.find(
      b => b.assetId === this.asset
    );
    return transferrableBalance && transferrableBalance.balance >= amount;
  };
}

export default TransferModel;
