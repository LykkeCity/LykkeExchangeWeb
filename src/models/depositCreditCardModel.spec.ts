import {RootStore} from '../stores';
import {AssetModel, DepositCreditCardModel, WalletModel} from './';
import {convertFieldName} from './depositCreditCardModel';

const rootStore = new RootStore();
const wallet = new WalletModel(rootStore.walletStore);
wallet.id = 'foo';

const deposit = new DepositCreditCardModel({
  address: 'Address',
  amount: 10,
  asset: new AssetModel({id: 'USD'}),
  city: 'City',
  country: 'Country',
  email: 'test@mail.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '123123123',
  wallet,
  zip: '12345'
});

describe('convertFieldName', () => {
  it('should convert API field name', () => {
    expect(convertFieldName('Address')).toBe('address');
    expect(convertFieldName('Amount')).toBe('amount');
    expect(convertFieldName('AssetId')).toBe('assetId');
    expect(convertFieldName('City')).toBe('city');
    expect(convertFieldName('Country')).toBe('country');
    expect(convertFieldName('Email')).toBe('email');
    expect(convertFieldName('FirstName')).toBe('firstName');
    expect(convertFieldName('LastName')).toBe('lastName');
    expect(convertFieldName('Phone')).toBe('phone');
    expect(convertFieldName('WalletId')).toBe('walletId');
    expect(convertFieldName('Zip')).toBe('zip');
  });
});

describe('DepositCreditCardModel', () => {
  it('should convert field names to API json', () => {
    expect(deposit.asJson.Address).toBe(deposit.address);
    expect(deposit.asJson.Amount).toBe(deposit.amount);
    expect(deposit.asJson.AssetId).toBe(deposit.asset.id);
    expect(deposit.asJson.City).toBe(deposit.city);
    expect(deposit.asJson.Country).toBe(deposit.country);
    expect(deposit.asJson.Email).toBe(deposit.email);
    expect(deposit.asJson.FirstName).toBe(deposit.firstName);
    expect(deposit.asJson.LastName).toBe(deposit.lastName);
    expect(deposit.asJson.Phone).toBe(deposit.phone);
    expect(deposit.asJson.WalletId).toBe(deposit.wallet.id);
    expect(deposit.asJson.Zip).toBe(deposit.zip);

    expect(deposit.asJson.DepositOption).toBe('BankCard');
  });

  it('should update model', () => {
    expect(deposit.amount).toBe(10);
    deposit.update({amount: 20});
    expect(deposit.amount).toBe(20);
  });
});
