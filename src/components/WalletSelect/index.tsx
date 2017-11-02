import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models/index';
import {Select, SelectProps} from '../Select';

const optionRenderer = (baseCurrency: string) => (wallet: WalletModel) => (
  <div className="option">
    <div>{wallet.title}</div>
    <div>
      {wallet.totalBalance.balance}&nbsp;{baseCurrency}
    </div>
  </div>
);

type MyWalletSelectProps = RootStoreProps & SelectProps;

export class WalletSelect extends React.Component<MyWalletSelectProps> {
  render() {
    return (
      <Select
        valueKey="id"
        labelKey="title"
        clearable={false}
        optionRenderer={optionRenderer(
          this.props.rootStore!.profileStore.baseCurrency
        )}
        {...this.props}
      />
    );
  }
}

export default inject(STORE_ROOT)(observer(WalletSelect));
