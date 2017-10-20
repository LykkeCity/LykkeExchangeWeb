import {WalletModel} from '.';
import {RootStore} from '../stores';

const rootStore = new RootStore();
const {transferStore} = rootStore;

describe('transfer model', () => {
  it('should correctly and automaticaly update qr', () => {
    const amount = 10;
    const walletId = 1;
    const sut = transferStore.createTransfer();
    sut.update({
      from: new WalletModel({Id: walletId}),
      // tslint:disable-next-line:object-literal-sort-keys
      amount,
      asset: 'LKK'
    });

    expect(sut.asQr).toBe(
      btoa(
        JSON.stringify({
          AccountId: walletId,
          Amount: amount
        })
      )
    );
    expect(JSON.parse(atob(sut.asQr)).Amount).toBe(amount);
    expect(JSON.parse(atob(sut.asQr)).AccountId).toBe(walletId);
  });

  it('should merge transfer object', () => {
    const sut = transferStore.createTransfer();
    sut.update({
      amount: 100,
      asset: 'LKK',
      from: new WalletModel({Id: 1})
    });

    expect(sut.amount).toBe(100);
    expect(sut.from.id).toBe(1);
    expect(sut.asset).toBe('LKK');
  });

  it('should call transfer method', () => {
    const sut = transferStore.createTransfer();
    sut.update({
      from: new WalletModel(),
      to: new WalletModel(),
      // tslint:disable-next-line:object-literal-sort-keys
      amount: 10,
      asset: 'LKK'
    });
    transferStore.transfer = jest.fn();

    sut.submit();

    expect(transferStore.transfer).toBeCalled();
  });
});
