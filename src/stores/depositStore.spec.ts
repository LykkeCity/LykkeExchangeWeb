import {DepositStore, RootStore} from '.';

const rootStore = new RootStore();
const mockApi = {
  fetchBankCardPaymentUrl: jest.fn(),
  fetchDepositDefaultValues: jest.fn(),
  fetchFee: jest.fn(),
  fetchSwiftRequisites: jest.fn(),
  sendSwiftRequisites: jest.fn()
};
const depositStore = new DepositStore(rootStore, mockApi);

describe('deposit credit card store', () => {
  it('should hold strongly typed ref to the root store', () => {
    expect(depositStore).toHaveProperty('rootStore');
    expect(depositStore.rootStore).toBeDefined();
    expect(depositStore.rootStore).toBeInstanceOf(RootStore);
  });

  it('should set and reset payment urls', () => {
    depositStore.setGatewayUrls({
      cancelUrl: 'cancel',
      failUrl: 'foo',
      okUrl: 'bar',
      paymentUrl: 'baz'
    });
    expect(depositStore.gatewayUrls.cancelUrl).toBe('cancel');
    expect(depositStore.gatewayUrls.failUrl).toBe('foo');
    expect(depositStore.gatewayUrls.okUrl).toBe('bar');
    expect(depositStore.gatewayUrls.paymentUrl).toBe('baz');

    depositStore.resetCurrentDeposit();
    expect(depositStore.gatewayUrls.cancelUrl).toBe('');
    expect(depositStore.gatewayUrls.failUrl).toBe('');
    expect(depositStore.gatewayUrls.okUrl).toBe('');
    expect(depositStore.gatewayUrls.paymentUrl).toBe('');
  });

  it('should reset deposit', () => {
    depositStore.newDeposit.update({amount: 99});
    expect(depositStore.newDeposit.amount).toBe(99);
    depositStore.resetCurrentDeposit();
    expect(depositStore.newDeposit.amount).toBe(0);
  });

  it('should populate new deposit with default values from API', async () => {
    mockApi.fetchDepositDefaultValues = jest.fn(() => {
      return {
        FirstName: 'foo'
      };
    });
    expect(depositStore.newDeposit.firstName).toBe('');
    await depositStore.fetchDepositDefaultValues();
    expect(depositStore.newDeposit.firstName).toBe('foo');
    depositStore.newDeposit.update({firstName: 'bar'});
    expect(depositStore.newDeposit.firstName).toBe('bar');
    depositStore.resetCurrentDeposit();
    expect(depositStore.newDeposit.firstName).toBe('foo');
  });

  it('should handle API 503 error', async () => {
    mockApi.fetchBankCardPaymentUrl = jest.fn(() => {
      throw new Error();
    });
    await expect(
      depositStore.fetchBankCardPaymentUrl(depositStore.newDeposit)
    ).rejects.toHaveProperty('message');
  });

  it('should handle API validation error', async () => {
    mockApi.fetchBankCardPaymentUrl = jest.fn(() => {
      throw new Error();
    });
    await expect(
      depositStore.fetchBankCardPaymentUrl(depositStore.newDeposit)
    ).rejects.toHaveProperty('message');
  });

  it('should handle successful API state', async () => {
    mockApi.fetchBankCardPaymentUrl = jest.fn(() => ({
      Result: {
        CancelUrl: 'cancel',
        FailUrl: 'foo',
        OkUrl: 'bar',
        Url: 'baz'
      }
    }));
    await expect(
      depositStore.fetchBankCardPaymentUrl(depositStore.newDeposit)
    ).resolves.toHaveProperty('failUrl');
    await expect(
      depositStore.fetchBankCardPaymentUrl(depositStore.newDeposit)
    ).resolves.toHaveProperty('okUrl');
    await expect(
      depositStore.fetchBankCardPaymentUrl(depositStore.newDeposit)
    ).resolves.toHaveProperty('paymentUrl');
  });
});
