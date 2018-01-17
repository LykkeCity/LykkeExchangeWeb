import * as React from 'react';
import {AssetModel, BalanceModel} from '../../models';
import {asAssetBalance} from '../hoc/assetBalance';

interface AssetOption {
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

export const AssetOption = ({asset, balanceAvailable}: AssetOption) => (
  <div className="option">
    <div>{asset.name}</div>
    <div>
      <small style={{color: 'gray'}}>
        {asAssetBalance(asset, balanceAvailable)}
      </small>
    </div>
  </div>
);

export default AssetOption;
