import {RootStore, TransferStore} from '.';
import {AssetModel, TransferModel} from '../models';

const rootStore = new RootStore();
const mockTransferApi = {
  cancelTransfer: jest.fn(),
  fetchOperationDetails: jest.fn(),
  startTransfer: jest.fn()
};
const transferStore = new TransferStore(rootStore, mockTransferApi as any);
rootStore.assetStore.getById = jest.fn();
const {createTransfer} = transferStore;
const {walletStore: {createWallet}} = rootStore;
rootStore.assetStore.getById = jest.fn(() => ({
  id: 'LKK',
  name: 'LKK',
  // tslint:disable-next-line:object-literal-sort-keys
  category: 'Lykke'
}));

const createValidTransfer = (transfer: TransferModel) => {
  const sourceWallet = createWallet({
    Id: 1,
    Name: 'w1',
    // tslint:disable-next-line:object-literal-sort-keys
    Balances: [{AssetId: 'LKK', Balance: 100, Reserved: 0}]
  });
  const destWallet = createWallet({
    Id: 2,
    Name: 'w2',
    // tslint:disable-next-line:object-literal-sort-keys
    Balances: [{AssetId: 'LKK', Balance: 100, Reserved: 0}]
  });
  transfer.setWallet(sourceWallet, 'from');
  transfer.setWallet(destWallet, 'to');
  transfer.setAmount(100);
  transfer.setAsset(new AssetModel({id: 'LKK', name: 'LKK'}));
  return transfer;
};

describe('transfer store', () => {
  it('should hold strongly typed ref to the root store', () => {
    expect(transferStore).toHaveProperty('rootStore');
    expect(transferStore.rootStore).toBeDefined();
    expect(transferStore.rootStore).toBeInstanceOf(RootStore);
  });

  it('should hold transfers', () => {
    const {transfers} = transferStore;
    expect(transfers).toBeDefined();
    expect(transfers.length).toBe(0);
  });

  it('should add transfers', () => {
    transferStore.addTransfer(new TransferModel(transferStore));

    expect(transferStore.transfers.length).toBe(1);
  });

  it('should create transfers', () => {
    const sut = transferStore.createTransfer();

    expect(sut).toBeDefined();
    expect(sut).not.toBeNull();
  });

  it('createTransfer should provide an id', () => {
    const sut = createTransfer();

    expect(sut.id).toBeDefined();
    expect(sut.id).not.toBeNull();
  });

  it('newTransfer should not be added to transfer list', () => {
    const store = new TransferStore(rootStore, mockTransferApi);

    expect(store.transfers.length).toBe(0);
    expect(store.transfers).not.toContain(store.newTransfer);
  });

  describe('should reset new transfer', () => {
    it('should provide reset method', () => {
      expect(transferStore.resetCurrentTransfer).toBeDefined();
    });

    it('should correctly reset transfer', () => {
      const oldTransfer = transferStore.newTransfer;
      const oldId = oldTransfer.id;

      transferStore.resetCurrentTransfer();

      expect(transferStore.newTransfer).toBeDefined();
      expect(transferStore.newTransfer).not.toBeNull();
      expect(transferStore.newTransfer.id).not.toBe(oldId);
    });

    it('should reset transfer to blank state', () => {
      const oldTransfer = transferStore.newTransfer;

      transferStore.resetCurrentTransfer();

      // expect(transferStore.newTransfer.asset).toBe(new AssetModel({}));
      expect(transferStore.newTransfer.amount).toBe(0);
      expect(transferStore.newTransfer).not.toEqual(oldTransfer);
      expect(transferStore.newTransfer.canTransfer).toBe(false);
    });

    it('should reset wallets when resetting a transfer', () => {
      const {from: {id: fromId}, to: {id: toId}} = createValidTransfer(
        transferStore.newTransfer
      );
      transferStore.resetCurrentTransfer();

      expect(transferStore.newTransfer.from.id).not.toBe(fromId);
      expect(transferStore.newTransfer.to).not.toBe(toId);
    });

    it('should not add resetted transfer to store', () => {
      transferStore.transfers = [];
      transferStore.resetCurrentTransfer();

      expect(transferStore.transfers.length).toBe(0);
      expect(transferStore.transfers).not.toContainEqual(
        transferStore.newTransfer
      );
    });
  });

  describe('submit transfer', () => {
    const sut = transferStore.createTransfer(false);

    beforeEach(() => {
      createValidTransfer(sut);
    });

    test('sanity check on transfer create helper', () => {
      expect(createValidTransfer(sut).canTransfer).toBe(true);
    });

    it('should pass dest wallet id to the transfer object', () => {
      expect(sut.asJson.WalletId).toBe(sut.to.id);
    });

    it('should not call api when transfer is not valid', () => {
      transferStore.startTransfer = jest.fn();
      sut.asset = new AssetModel({id: '1'});

      sut.sendTransfer();

      expect(transferStore.startTransfer).not.toBeCalled();
    });

    it('should call api when transfer is valid', () => {
      transferStore.startTransfer = jest.fn();

      sut.sendTransfer();

      expect(transferStore.startTransfer).toBeCalled();
      expect(transferStore.startTransfer).toBeCalledWith(sut);
    });
  });

  describe('finish transfer', () => {
    const sut = transferStore.createTransfer(false);

    beforeEach(() => {
      createValidTransfer(sut);
      sut.from.deposit = jest.fn();
      sut.from.withdraw = jest.fn();
      sut.to.deposit = jest.fn();
      sut.to.withdraw = jest.fn();
    });

    it('should call deposit and withdraw on related wallets', () => {
      transferStore.finishTransfer(sut);

      expect(sut.from.withdraw).toBeCalled();
      expect(sut.from.deposit).not.toBeCalled();
      expect(sut.to.deposit).toBeCalled();
      expect(sut.to.withdraw).not.toBeCalled();
    });

    it('should call deposit on dest wallet with transfer amount and asset', () => {
      transferStore.finishTransfer(sut);
      expect(sut.to.deposit).toBeCalledWith(sut.amount, sut.asset);
    });

    it('should call withdraw on source wallet with transfer amount and asset', () => {
      transferStore.finishTransfer(sut);
      expect(sut.from.withdraw).toBeCalledWith(sut.amount, sut.asset);
    });

    it('should reset current transfer', () => {
      const sut2 = createValidTransfer(transferStore.newTransfer);
      const id = transferStore.newTransfer.id;

      transferStore.finishTransfer(sut2);

      expect(transferStore.newTransfer.canTransfer).toBe(false);
      expect(transferStore.newTransfer.id).not.toBe(id);
    });
  });
});
