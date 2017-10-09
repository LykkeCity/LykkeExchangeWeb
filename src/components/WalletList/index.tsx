import Collapse from 'antd/lib/collapse/Collapse';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {STORE_ROOT} from '../../constants/stores';
import {RootStore} from '../../stores/index';

const {Panel} = Collapse;

export const WalletList = ({rootStore}: {rootStore?: RootStore}) => (
  <Collapse accordion={true}>
    {rootStore!.walletStore.wallets.map(w => (
      <Panel header={w.name} key={w.id}>
        <p>{w.name}</p>
      </Panel>
    ))}
  </Collapse>
);

export default inject(STORE_ROOT)(observer(WalletList));
