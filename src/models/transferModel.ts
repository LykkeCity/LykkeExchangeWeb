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
    return !!this.from && !!this.to && !!this.amount && !!this.asset;
  }

  constructor(private store: TransferStore) {
    this.store = store;
    this.id = uuid.v4();

    reaction(
      () => this.amount + this.asset,
      async () => {
        if (!!this.amount && !!this.asset) {
          await this.store.convertToBaseCurrency(
            this,
            this.store.rootStore.profileStore.baseAsset
          );
        }
      }
    );
  }

  updateFromJson = (json: any) => {
    if (json.Converted[0]) {
      this.amountInBaseCurrency = json.Converted[0].To.Amount;
    }
  };

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

  cancel = () => this.store.cancelTransfer(this);
}

export default TransferModel;
