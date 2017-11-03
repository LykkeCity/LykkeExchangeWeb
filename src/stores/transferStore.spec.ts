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

  it('should provide an id', () => {
    const sut = createTransfer();

    expect(sut.id).toBeDefined();
    expect(sut.id).not.toBeNull();
  });

  it('should not convert if transfer currency is the same as base one', () => {
    const transferModel = new TransferModel(transferStore);
    transferModel.asset = 'TEST';
    const baseCurrency = 'TEST';

    transferStore.convertToBaseCurrency(transferModel, baseCurrency);

    expect(mockConverterApi.convertToBaseAsset).not.toBeCalled();
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
