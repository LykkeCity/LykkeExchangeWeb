import {Icon} from 'antd';
import Col from 'antd/lib/grid/col';
import Row from 'antd/lib/grid/row';
import classnames from 'classnames';
import {observer} from 'mobx-react';
import * as React from 'react';
import {WalletModel} from '../../models';
import WalletTotalBalance from '../WalletTotalBalance/index';

interface WalletSummaryProps {
  wallet: WalletModel;
}

export const WalletSummary: React.SFC<WalletSummaryProps> = ({wallet}) => (
  <Row className={classnames({'wallet--expanded': wallet.expanded})}>
    <Col span={10} offset={2}>
      <h2 className="wallet__title">
        {wallet.title}
        <Icon
          type={wallet.expanded ? 'up' : 'down'}
          onClick={wallet.toggleCollapse}
        />
      </h2>
      <div className="wallet__desc">{wallet.desc}</div>
    </Col>
    <Col span={10} offset={2}>
      <WalletTotalBalance wallet={wallet} />
    </Col>
  </Row>
);

export default observer(WalletSummary);
