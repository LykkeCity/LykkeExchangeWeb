import {shallow} from 'enzyme';
import React from 'react';
import {AssetModel, BalanceModel, WalletModel} from '../../../models';
import {RootStore} from '../../../stores';
import {BalanceSection} from '../index';

describe('<BalanceSection>', () => {
  const rootStore = new RootStore();
  const getTestBalanceSection = () => {
    return <BalanceSection rootStore={rootStore} />;
  };

  beforeEach(() => {
    rootStore.assetStore.getById = jest.fn(
      () =>
        new AssetModel({
          accuracy: 2,
          name: 'USD'
        })
    );

    const USDBalance = new BalanceModel(rootStore.balanceStore, {
      balanceInBaseAsset: 1000,
      reservedBalanceInBaseAsset: 1
    });
    const BTCBalance = new BalanceModel(rootStore.balanceStore, {
      balanceInBaseAsset: 5,
      reservedBalanceInBaseAsset: 0
    });
    const ETCBalance = new BalanceModel(rootStore.balanceStore, {
      balanceInBaseAsset: 10,
      reservedBalanceInBaseAsset: 0
    });
    rootStore.walletStore.wallets = [
      new WalletModel(rootStore.walletStore, {
        balances: [USDBalance, BTCBalance]
      }),
      new WalletModel(rootStore.walletStore, {balances: [ETCBalance]})
    ];
  });

  describe('method render', () => {
    it('should render base asset name in all balances', () => {
      const wrapper = shallow(getTestBalanceSection());
      const balanceItems = wrapper.find('.balance-list__total');
      for (let i = 0; i < balanceItems.length; i++) {
        const didBalanceHaveBaseAssetName = balanceItems
          .at(i)
          .text()
          .includes('USD');
        expect(didBalanceHaveBaseAssetName).toBe(true);
      }
    });
  });
});
