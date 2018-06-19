import {action, computed, observable} from 'mobx';
import * as uuid from 'uuid';
import {AssetModel, WalletModel} from '.';
import {TransferStore} from '../stores';

export class TransferModel {
  id = '';
  @observable from: WalletModel;
  @observable to: WalletModel;
  @observable amount: number = 0;
  @observable asset: AssetModel;

  @computed
  get amountInBaseCurrency() {
    return this.store.convertToBaseCurrency(this);
  }

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
