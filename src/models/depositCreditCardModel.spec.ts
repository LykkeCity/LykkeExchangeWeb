import {RootStore} from '../stores';
import {AssetModel, DepositCreditCardModel, WalletModel} from './';

const rootStore = new RootStore();
const wallet = new WalletModel(rootStore.walletStore);
wallet.id = 'foo';

const deposit = new DepositCreditCardModel({
  amount: 10,
  asset: new AssetModel({id: 'USD'}),
  wallet
});

describe('DepositCreditCardModel', () => {
  it('should convert field names to API json', () => {
    expect(deposit.asJson.Amount).toBe(deposit.amount);
    expect(deposit.asJson.AssetId).toBe(deposit.asset.id);
  });

  it('should update model', () => {
    expect(deposit.amount).toBe(10);
    deposit.update({amount: 20});
    expect(deposit.amount).toBe(20);
  });
});
