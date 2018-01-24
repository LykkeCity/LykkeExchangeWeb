import * as React from 'react';
import {AssetModel, BalanceModel} from '../../models/index';
import {formatWithAccuracy} from '../../utils/index';
import {NumberFormat} from '../NumberFormat/index';

export const asAssetBalance = (asset: AssetModel, balance: number) => {
  const format = formatWithAccuracy(asset.accuracy);
  return <NumberFormat value={balance} format={format} />;
};

export const asBalance = (balance: BalanceModel) => {
  const format = formatWithAccuracy(balance.asset.accuracy);
  return <NumberFormat value={balance.availableBalance} format={format} />;
};

export default asBalance;
