import {RootStore} from '../stores';
import {TransferModel} from './index';

const rootStore = new RootStore();
const {transferStore, walletStore, walletStore: {createWallet}} = rootStore;
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
    sut.setWallet(createWallet({Id: ' -' + walletId}), 'from');
    sut.setWallet(createWallet({Id: walletId}), 'to');
    sut.setAmount(amount);
    sut.setAsset('LKK');

    expect(sut.asBase64).toBe(btoa(JSON.stringify(sut.asJson)));
    expect(JSON.parse(atob(sut.asBase64))).toEqual(sut.asJson);
    expect(JSON.parse(atob(sut.asBase64)).Amount).toBe(amount);
    expect(JSON.parse(atob(sut.asBase64)).WalletId).toBe(walletId);
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
    transferStore.startTransfer = jest.fn();

    sut.sendTransfer();

    expect(transferStore.startTransfer).toBeCalled();
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

    it('should return true when all fields are not empty', () => {
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
