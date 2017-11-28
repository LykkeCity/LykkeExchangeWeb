import {action, computed, observable, reaction} from 'mobx';
import * as uuid from 'uuid';
import {AssetModel, WalletModel} from '.';
import {TransferStore} from '../stores';

export class TransferModel {
  id = '';
  @observable from: WalletModel;
  @observable to: WalletModel;
  @observable amount: number = 0;
  @observable asset: AssetModel;

  @observable isUpdating: boolean = false;

  @observable amountInBaseCurrency: number;

  @computed
  get asJson() {
    return {
      Amount: this.amount,
      AssetId: this.asset.id,
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
      !!this.from.id &&
      !!this.to &&
      !!this.to.id &&
      this.from.id !== this.to.id &&
      !!this.amount &&
      !!this.asset &&
      !!this.asset.id &&
      !!this.hasEnoughAmount(this.amount)
    );
  }

  constructor(private store: TransferStore) {
    this.store = store;
    const {createWallet} = this.store.rootStore.walletStore;
    this.id = uuid.v4();
    this.from = createWallet();
    this.to = createWallet();

    reaction(
      () => ({amount: this.amount, asset: this.asset}),
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
  setAsset = (asset: AssetModel) => {
    this.asset = asset;
  };

  sendTransfer = async () => {
    if (this.canTransfer) {
      return await this.store.startTransfer(this);
    }
  };

  cancel = async () => this.store.cancelTransfer(this);

  hasEnoughAmount = (amount: number) => {
    const transferrableBalance = this.from.balances.find(
      b => b.assetId === this.asset.id
    );

    return (
      transferrableBalance && transferrableBalance.availableBalance >= amount
    );
  };
}

export default TransferModel;
