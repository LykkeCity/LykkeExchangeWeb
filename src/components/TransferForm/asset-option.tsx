import * as React from 'react';
import {AssetModel, BalanceModel} from '../../models';
import {asAssetBalance} from '../hoc/assetBalance';
import {SelectItem} from '../Select';

interface AssetOptionProps {
  asset: AssetModel;
  assetId: string;
  assetName: string;
  balance: number;
  balanceAvailable: number;
}

export const assetsOptionsMap = (b: BalanceModel) => ({
  asset: b.asset,
  assetId: b.asset.id,
  assetName: b.asset.name,
  balance: b.balance,
  balanceAvailable: b.availableBalance
});

export const AssetOption = ({asset, balanceAvailable}: AssetOptionProps) => (
  <SelectItem name={asset.name}>
    {asAssetBalance(asset, balanceAvailable)}
  </SelectItem>
);

export default AssetOption;
