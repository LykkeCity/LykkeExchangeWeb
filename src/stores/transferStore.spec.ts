import {RootStore, TransferStore} from '.';
import {ConverterApi, TransferApi} from '../api';
import {TransferModel} from '../models';

const rootStore = new RootStore();
const converterApi = new ConverterApi(rootStore);
converterApi.convertToBaseAsset = jest.fn();
const transferStore = new TransferStore(
  rootStore,
  new TransferApi(rootStore),
  converterApi
);

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

  it('should not convert if transfer currency is the same as base one', () => {
    const transferModel = new TransferModel(transferStore);
    transferModel.asset = 'TEST';
    const baseCurrency = 'TEST';

    transferStore.convertToBaseCurrency(transferModel, baseCurrency);

    expect(converterApi.convertToBaseAsset).not.toBeCalled();
  });
});
