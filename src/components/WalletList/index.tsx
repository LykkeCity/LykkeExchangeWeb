import Col from 'antd/lib/grid/col';
import Row from 'antd/lib/grid/row';
import 'antd/lib/grid/style/css';
import * as classnames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {InjectedRootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import {loadable, LoadableProps} from '../hoc/loadable';
import WalletBalanceList from '../WalletBalanceList';
import WalletSummary from '../WalletSummary/index';
import './style.css';

export const WalletList: React.SFC<InjectedRootStoreProps & LoadableProps> = ({
  rootStore
}) => (
  <div className="wallet__list">
    {rootStore!.walletStore.wallets.map(w => (
      <div key={w.id} className={classnames('wallet')}>
        <WalletSummary wallet={w} />
        <Row>
          <Col span={19} offset={3}>
            {w.expanded && <WalletBalanceList wallet={w} />}
          </Col>
        </Row>
      </div>
    ))}
  </div>
);

export default loadable(inject(STORE_ROOT)(observer(WalletList)));
