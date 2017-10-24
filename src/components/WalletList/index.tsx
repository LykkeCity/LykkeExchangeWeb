import Col from 'antd/lib/grid/col';
import Row from 'antd/lib/grid/row';
import 'antd/lib/grid/style/css';
import * as classnames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {InjectedRootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import {loadable, LoadableProps} from '../hoc/loadable';
import WalletActionBar from '../WalletActionBar';
import WalletBalanceList from '../WalletBalanceList';
import WalletSummary from '../WalletSummary';
import './style.css';

type WalletListProps = InjectedRootStoreProps & LoadableProps;

export const WalletList: React.SFC<WalletListProps> = ({rootStore}) => (
  <div className="wallet__list">
    {rootStore!.walletStore.wallets.map(w => (
      <div
        key={w.id}
        className={classnames('wallet', {'wallet--expanded': w.expanded})}
      >
        <WalletSummary wallet={w} />
        {w.expanded && [
          <Row key={WalletActionBar.name}>
            <Col span={18} offset={2}>
              <WalletActionBar wallet={w} />
            </Col>
          </Row>,
          <Row key={WalletBalanceList.name}>
            <Col span={18} offset={2}>
              <WalletBalanceList wallet={w} />
            </Col>
          </Row>
        ]}
      </div>
    ))}
  </div>
);

export default loadable(inject(STORE_ROOT)(observer(WalletList)));
