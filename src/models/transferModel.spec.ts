import {TransferModel, WalletModel} from '.';
import {RootStore} from '../stores';

const rootStore = new RootStore();
const {transferStore} = rootStore;

describe('transfer model', () => {
  test('blank should return an empty transfer object', () => {
    const sut = TransferModel.empty(transferStore);

    expect(sut).toBeDefined();
    expect(sut).not.toBeNull();
    expect(sut.amount).toBe(0);
    expect(sut.asset).toBe('');
    expect(sut.from).toBeDefined();
    expect(sut.to).toBeDefined();
  });

  it('should correctly and automaticaly update qr', () => {
    const amount = 10;
    const walletId = 1;
    const sut = TransferModel.create(
      new WalletModel({Id: walletId}),
      new WalletModel(),
      amount,
      'LKK',
      transferStore
    );

    expect(sut.qr).toBe(
      btoa(
        JSON.stringify({
          AccountId: walletId,
          Amount: amount
        })
      )
    );
    expect(JSON.parse(atob(sut.qr)).Amount).toBe(amount);
    expect(JSON.parse(atob(sut.qr)).AccountId).toBe(walletId);
  });

  it('should merge transfer object', () => {
    const sut = TransferModel.create(
      new WalletModel({Id: 1}),
      new WalletModel(),
      10,
      'LKK',
      transferStore
    );

    sut.update({
      amount: 100
    });

    expect(sut.amount).toBe(100);
    expect(sut.from.id).toBe(1);
    expect(sut.asset).toBe('LKK');
  });

  it('should call transfer method', () => {
    const sut = TransferModel.create(
      new WalletModel(),
      new WalletModel(),
      10,
      'LKK',
      transferStore
    );
    transferStore.transfer = jest.fn();

    sut.submit();

    expect(transferStore.transfer).toBeCalled();
  });
});
