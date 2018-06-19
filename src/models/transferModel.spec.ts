import {RootStore} from '../stores';
import {AssetModel, TransferModel} from './index';

const rootStore = new RootStore();
const {transferStore, walletStore} = rootStore;

describe('transfer model', () => {
  it('should correctly and automaticaly update qr', () => {
    const sut = transferStore.createTransfer();

    expect(sut.asBase64).toBe(btoa(JSON.stringify({Id: sut.id})));
    expect(JSON.parse(atob(sut.asBase64))).toEqual({Id: sut.id});
    expect(JSON.parse(atob(sut.asBase64)).Id).toBe(sut.id);
  });

  it('should merge transfer object', () => {
    const sut = transferStore.createTransfer();
    sut.update({
      amount: 100,
      asset: new AssetModel({id: 'LKK', name: 'LKK'}),
      from: walletStore.createWallet({Id: 1})
    });

    expect(sut.amount).toBe(100);
    expect(sut.from.id).toBe(1);
    expect(sut.asset.id).toBe('LKK');
  });

  it('should call transfer method', () => {
    const sut = transferStore.createTransfer();
    sut.update({
      from: walletStore.createWallet({Id: 'src'}),
      to: walletStore.createWallet({Id: 'dest'}),
      // tslint:disable-next-line:object-literal-sort-keys
      amount: 10,
      asset: new AssetModel({id: '1', name: 'LKK'})
    });
    sut.hasEnoughAmount = jest.fn(() => true);
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
        asset: new AssetModel({name: 'LKK'})
      });
      const transfer2 = transferStore.createTransfer();
      transfer2.update({
        from: walletStore.createWallet(),
        to: walletStore.createWallet(),
        // tslint:disable-next-line:object-literal-sort-keys
        amount: 10,
        asset: new AssetModel({name: ''})
      });

      expect(transfer.canTransfer).toBe(false);
      expect(transfer2.canTransfer).toBe(false);
    });

    it('should return true when all fields are not empty', () => {
      transfer.update({
        from: walletStore.createWallet({Id: '1'}),
        to: walletStore.createWallet({Id: '2'}),
        // tslint:disable-next-line:object-literal-sort-keys
        amount: 10,
        asset: new AssetModel({id: 'LKK', name: 'LKK'})
      });
      transfer.hasEnoughAmount = jest.fn(() => true); // TODO: to implement properly

      expect(transfer.canTransfer).toBe(true);
    });

    it('should be false when source wallet id is not presented', () => {
      transfer.update({
        from: walletStore.createWallet(),
        to: walletStore.createWallet(),
        // tslint:disable-next-line:object-literal-sort-keys
        amount: 10,
        asset: new AssetModel({name: 'LKK'})
      });
      transfer.hasEnoughAmount = jest.fn(() => true); // TODO: to implement properly

      expect(transfer.canTransfer).toBe(false);
    });

    it('should be false when target wallet id is not presented', () => {
      transfer.update({
        from: walletStore.createWallet(),
        to: walletStore.createWallet(),
        // tslint:disable-next-line:object-literal-sort-keys
        amount: 10,
        asset: new AssetModel({name: 'LKK'})
      });
      transfer.hasEnoughAmount = jest.fn(() => true); // TODO: to implement properly

      expect(transfer.canTransfer).toBe(false);
    });

    it('should be false when asset or asset id is not presented', () => {
      transfer.update({
        from: walletStore.createWallet({Id: 'src'}),
        to: walletStore.createWallet({Id: 'dest'}),
        // tslint:disable-next-line:object-literal-sort-keys
        amount: 10,
        asset: new AssetModel({})
      });
      transfer.hasEnoughAmount = jest.fn(() => true); // TODO: to implement properly

      expect(transfer.canTransfer).toBe(false);
    });

    describe('can transfer w/ amount given', () => {
      const assetId = 'LKK';

      beforeEach(() => {
        rootStore.assetStore.getById = jest.fn(() => ({
          id: assetId,
          name: assetId
        }));
        transfer.setWallet(walletStore.createWallet({Id: 'dest'}), 'to');
        transfer.setAsset(new AssetModel({id: assetId, name: assetId}));
      });

      it('should return false if desired amount less than available balance', () => {
        const sourceWallet = walletStore.createWallet({Id: 'src'});
        sourceWallet.setBalances([
          {AssetId: assetId, Balance: 100, Reserved: 100}
        ]);

        transfer.setWallet(sourceWallet, 'from');
        transfer.setAmount(1);

        expect(transfer.canTransfer).toBe(false);
      });

      it('should return true if desired amount greater than or equal to available balance', () => {
        const sourceWallet = walletStore.createWallet({Id: 'src'});
        sourceWallet.setBalances([
          {AssetId: assetId, Balance: 100, Reserved: 90}
        ]);

        transfer.setWallet(sourceWallet, 'from');
        transfer.setAmount(5);

        expect(transfer.canTransfer).toBe(true);
      });

      it('should return false if enough amount but source and dest wallets are the same', () => {
        const sourceWallet = walletStore.createWallet({Id: 'src'});
        sourceWallet.setBalances([
          {AssetId: assetId, Balance: 100, Reserved: 90}
        ]);

        transfer.setWallet(sourceWallet, 'from');
        transfer.setWallet(sourceWallet, 'to');
        transfer.setAmount(5);

        expect(transfer.canTransfer).toBe(false);
      });

      it('should return true if reserved is not provided and balance gt amount', () => {
        const sourceWallet = walletStore.createWallet({Id: 'src'});
        sourceWallet.setBalances([{AssetId: assetId, Balance: 100}]);

        transfer.setWallet(sourceWallet, 'from');
        transfer.setAmount(99);

        expect(transfer.canTransfer).toBe(true);
      });

      it('should return false if reserved is not provided and balance lt amount', () => {
        const sourceWallet = walletStore.createWallet({Id: 'src'});
        sourceWallet.setBalances([{AssetId: assetId, Balance: 100}]);

        transfer.setWallet(sourceWallet, 'from');
        transfer.setAmount(500);

        expect(transfer.canTransfer).toBe(false);
      });
    });
  });
});
