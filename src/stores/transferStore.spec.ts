import {RootStore, TransferStore} from '.';
import {TransferModel} from '../models';

const rootStore = new RootStore();
const mockTransferApi = {
  fetchOperationDetails: jest.fn(),
  transfer: jest.fn()
};
const mockConverterApi = {
  convertToBaseAsset: jest.fn(() => ({Converted: [{To: {Amount: 1}}]}))
};
const transferStore = new TransferStore(
  rootStore,
  mockTransferApi,
  mockConverterApi
);
const {createTransfer} = transferStore;
const {walletStore: {createWallet}} = rootStore;

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
    const store = new TransferStore(
      rootStore,
      mockTransferApi,
      mockConverterApi
    );

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

      expect(transferStore.newTransfer.asset).toBe('');
      expect(transferStore.newTransfer.amount).toBe(0);
      expect(transferStore.newTransfer).not.toEqual(oldTransfer);
      expect(transferStore.newTransfer.canTransfer).toBe(false);
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
    let sut: TransferModel;
    const createValidTransfer = (transfer?: TransferModel) => {
      sut = transfer || createTransfer();
      const sourceWallet = createWallet({Id: 1, Name: 'w1'});
      const destWallet = createWallet({Id: 2, Name: 'w2'});
      sut.setWallet(sourceWallet, 'from');
      sut.setWallet(destWallet, 'to');
      sut.setAmount(100);
      sut.setAsset('LKK');
      return sut;
    };

    beforeEach(() => {
      createValidTransfer();
    });

    test('sanity check on transfer create helper', () => {
      expect(createValidTransfer().canTransfer).toBe(true);
    });

    it('should pass dest wallet id to the transfer object', () => {
      expect(sut.asJson.WalletId).toBe(sut.to.id);
    });

    it('should not call api when transfer is not valid', () => {
      transferStore.transfer = jest.fn();
      sut.asset = '';

      sut.submit();

      expect(transferStore.transfer).not.toBeCalled();
    });

    it('should call api when transfer is valid', () => {
      transferStore.transfer = jest.fn();

      sut.submit();

      expect(transferStore.transfer).toBeCalled();
      expect(transferStore.transfer).toBeCalledWith(sut);
    });
  });
});
