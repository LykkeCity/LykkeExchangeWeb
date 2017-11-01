import {RootStore} from '../stores';
import {TransferModel} from './index';

const rootStore = new RootStore();
const {transferStore, walletStore} = rootStore;
transferStore.convertToBaseCurrency = jest.fn(() => ({
  Converted: [
    {
      To: {
        Amount: 100
      }
    }
  ]
}));

describe('transfer model', () => {
  it('should correctly and automaticaly update qr', () => {
    const amount = 10;
    const walletId = 1;
    const sut = transferStore.createTransfer();
    sut.update({
      from: walletStore.createWallet({Id: walletId}),
      // tslint:disable-next-line:object-literal-sort-keys
      amount,
      asset: 'LKK'
    });

    expect(sut.asBase64).toBe(
      btoa(
        JSON.stringify({
          AccountId: walletId,
          Amount: amount
        })
      )
    );
    expect(JSON.parse(atob(sut.asBase64)).Amount).toBe(amount);
    expect(JSON.parse(atob(sut.asBase64)).AccountId).toBe(walletId);
  });

  it('should merge transfer object', () => {
    const sut = transferStore.createTransfer();
    sut.update({
      amount: 100,
      asset: 'LKK',
      from: walletStore.createWallet({Id: 1})
    });

    expect(sut.amount).toBe(100);
    expect(sut.from.id).toBe(1);
    expect(sut.asset).toBe('LKK');
  });

  it('should call transfer method', () => {
    const sut = transferStore.createTransfer();
    sut.update({
      from: walletStore.createWallet(),
      to: walletStore.createWallet(),
      // tslint:disable-next-line:object-literal-sort-keys
      amount: 10,
      asset: 'LKK'
    });
    transferStore.transfer = jest.fn();

    sut.submit();

    expect(transferStore.transfer).toBeCalled();
  });

  describe('canTransfer method', () => {
    let transfer: TransferModel;

    beforeEach(() => {
      transfer = transferStore.createTransfer();
    });

    it('should provide canTransfer method', () => {
      expect(transfer.canTransfer).toBeDefined();
    });
    it('should return false on blank transfer', () => {
      expect(transfer.canTransfer).toBe(false);
    });
    it('should return false when some of the fields are empty', () => {
      transfer.update({
        from: walletStore.createWallet(),
        to: walletStore.createWallet(),
        // tslint:disable-next-line:object-literal-sort-keys
        amount: 0,
        asset: 'LKK'
      });
      const transfer2 = transferStore.createTransfer();
      transfer2.update({
        from: walletStore.createWallet(),
        to: walletStore.createWallet(),
        // tslint:disable-next-line:object-literal-sort-keys
        amount: 10,
        asset: ''
      });

      expect(transfer.canTransfer).toBe(false);
      expect(transfer2.canTransfer).toBe(false);
    });

    it('should return true when all fields contain data', () => {
      transfer.update({
        from: walletStore.createWallet(),
        to: walletStore.createWallet(),
        // tslint:disable-next-line:object-literal-sort-keys
        amount: 10,
        asset: 'LKK'
      });

      expect(transfer.canTransfer).toBe(true);
    });
  });
});
