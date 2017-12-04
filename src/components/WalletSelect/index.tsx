import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models/index';
import {NumberFormat} from '../NumberFormat';
import {Select, SelectProps} from '../Select';

const optionRenderer = (baseCurrency: string) => (wallet: WalletModel) => (
  <div className="option">
    <div>{wallet.title}</div>
    <div>
      <small style={{color: 'gray'}}>
        <NumberFormat value={wallet.totalBalance} />&nbsp;{baseCurrency}
      </small>
    </div>
  </div>
);

type MyWalletSelectProps = RootStoreProps & SelectProps;

export class WalletSelect extends React.Component<MyWalletSelectProps> {
  render() {
    const baseAsset = this.props.rootStore!.profileStore.baseAssetAsModel;
    return (
      <Select
        valueKey="id"
        labelKey="title"
        clearable={false}
        optionRenderer={baseAsset && optionRenderer(baseAsset.name)}
        {...this.props}
      />
    );
  }
}

export default inject(STORE_ROOT)(observer(WalletSelect));
