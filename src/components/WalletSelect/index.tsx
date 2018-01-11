import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import {AssetModel, WalletModel} from '../../models/index';
import {asAssetBalance} from '../hoc/assetBalance';
import {Select, SelectProps} from '../Select';

const optionRenderer = (baseAsset: AssetModel) => (wallet: WalletModel) => {
  return (
    <div className="option">
      <div>{wallet.title}</div>
      <div>
        <small style={{color: 'gray'}}>
          {asAssetBalance(baseAsset, wallet.totalBalance)} {baseAsset.name}
        </small>
      </div>
    </div>
  );
};

type MyWalletSelectProps = RootStoreProps & SelectProps;

export class WalletSelect extends React.Component<MyWalletSelectProps> {
  render() {
    const baseAsset = this.props.rootStore!.profileStore.baseAssetAsModel;
    return (
      <Select
        valueKey="id"
        labelKey="title"
        clearable={false}
        optionRenderer={baseAsset && optionRenderer(baseAsset)}
        {...this.props}
      />
    );
  }
}

export default inject(STORE_ROOT)(observer(WalletSelect));
