import * as React from 'react';
import {AssetModel, BalanceModel} from '../../models/index';
import {NumberFormat} from '../NumberFormat/index';

export const asAssetBalance = (asset: AssetModel, balance: number) => {
  return <NumberFormat value={balance} accuracy={asset.accuracy} />;
};

export const asBalance = (balance: BalanceModel) => {
  return (
    <NumberFormat value={balance.balance} accuracy={balance.asset.accuracy} />
  );
};

export default asBalance;
