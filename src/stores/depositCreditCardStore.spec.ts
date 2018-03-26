import {DepositCreditCardStore, RootStore} from '.';

const rootStore = new RootStore();
const mockApi = {
  fetchBankCardPaymentUrl: jest.fn(),
  fetchDepositDefaultValues: jest.fn()
};
const depositCreditCardStore = new DepositCreditCardStore(rootStore, mockApi);

describe('deposit credit card store', () => {
  it('should hold strongly typed ref to the root store', () => {
    expect(depositCreditCardStore).toHaveProperty('rootStore');
    expect(depositCreditCardStore.rootStore).toBeDefined();
    expect(depositCreditCardStore.rootStore).toBeInstanceOf(RootStore);
  });

  it('should set and reset payment urls', () => {
    depositCreditCardStore.setGatewayUrls({
      failUrl: 'foo',
      okUrl: 'bar',
      paymentUrl: 'baz'
    });
    expect(depositCreditCardStore.gatewayUrls.failUrl).toBe('foo');
    expect(depositCreditCardStore.gatewayUrls.okUrl).toBe('bar');
    expect(depositCreditCardStore.gatewayUrls.paymentUrl).toBe('baz');

    depositCreditCardStore.resetCurrentDeposit();
    expect(depositCreditCardStore.gatewayUrls.failUrl).toBe('');
    expect(depositCreditCardStore.gatewayUrls.okUrl).toBe('');
    expect(depositCreditCardStore.gatewayUrls.paymentUrl).toBe('');
  });

  it('should reset deposit', () => {
    depositCreditCardStore.newDeposit.update({amount: 99});
    expect(depositCreditCardStore.newDeposit.amount).toBe(99);
    depositCreditCardStore.resetCurrentDeposit();
    expect(depositCreditCardStore.newDeposit.amount).toBe(0);
  });

  it('should populate new deposit with default values from API', async () => {
    mockApi.fetchDepositDefaultValues = jest.fn(() => {
      return {
        Result: {
          FirstName: 'foo'
        }
      };
    });
    expect(depositCreditCardStore.newDeposit.firstName).toBe('');
    await depositCreditCardStore.fetchDepositDefaultValues();
    expect(depositCreditCardStore.newDeposit.firstName).toBe('foo');
    depositCreditCardStore.newDeposit.update({firstName: 'bar'});
    expect(depositCreditCardStore.newDeposit.firstName).toBe('bar');
    depositCreditCardStore.resetCurrentDeposit();
    expect(depositCreditCardStore.newDeposit.firstName).toBe('foo');
  });

  it('should handle API 503 error', async () => {
    mockApi.fetchBankCardPaymentUrl = jest.fn(() => {
      throw new Error();
    });
    await expect(
      depositCreditCardStore.fetchBankCardPaymentUrl(
        depositCreditCardStore.newDeposit
      )
    ).rejects.toHaveProperty('message');
  });

  it('should handle API validation error', async () => {
    mockApi.fetchBankCardPaymentUrl = jest.fn(() => ({
      Error: {
        Field: 'amount',
        Message: "Amount can't be empty"
      }
    }));
    await expect(
      depositCreditCardStore.fetchBankCardPaymentUrl(
        depositCreditCardStore.newDeposit
      )
    ).rejects.toHaveProperty('field');
    await expect(
      depositCreditCardStore.fetchBankCardPaymentUrl(
        depositCreditCardStore.newDeposit
      )
    ).rejects.toHaveProperty('message');
  });

  it('should handle successful API state', async () => {
    mockApi.fetchBankCardPaymentUrl = jest.fn(() => ({
      Result: {
        FailUrl: 'foo',
        OkUrl: 'bar',
        Url: 'baz'
      }
    }));
    await expect(
      depositCreditCardStore.fetchBankCardPaymentUrl(
        depositCreditCardStore.newDeposit
      )
    ).resolves.toHaveProperty('failUrl');
    await expect(
      depositCreditCardStore.fetchBankCardPaymentUrl(
        depositCreditCardStore.newDeposit
      )
    ).resolves.toHaveProperty('okUrl');
    await expect(
      depositCreditCardStore.fetchBankCardPaymentUrl(
        depositCreditCardStore.newDeposit
      )
    ).resolves.toHaveProperty('paymentUrl');
  });
});
