import {Icon} from 'antd';
import Col from 'antd/lib/grid/col';
import Row from 'antd/lib/grid/row';
import 'antd/lib/grid/style/css';
import * as classnames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {STORE_ROOT} from '../../constants/stores';
import {RootStore} from '../../stores/index';
import './style.css';

export const WalletList = ({rootStore}: {rootStore?: RootStore}) => (
  <div className="wallet__list">
    {rootStore!.walletStore.wallets.map(w => (
      <Row key={w.id} className="wallet">
        <Col span={10} offset={2}>
          <h2 className="wallet__title">
            {w.title}
            <Icon
              type={w.collapsed ? 'up' : 'down'}
              onClick={w.toggleCollapse}
            />
          </h2>
          <div className="wallet__desc">{w.desc}</div>
        </Col>
        <Col span={10} offset={2}>
          <div className="wallet__total-balance">Total balance</div>
          <h3 className="wallet__total-balance-value">{w.figures.total} LKK</h3>
          <div>
            <span className="wallet__figure">Received:</span>{' '}
            <span className="wallet__figure-val">{w.figures.received} LKK</span>
          </div>
          <div>
            <span className="wallet__figure">Sent:</span>{' '}
            <span className="wallet__figure-val">{w.figures.sent} LKK</span>
          </div>
          <div>
            <span className="wallet__figure">P&amp;L:</span>{' '}
            <span
              className={classnames(
                'wallet__figure-val',
                'wallet__figure-val--pl'
              )}
            >
              +{w.figures.pnl}
            </span>
          </div>
        </Col>
      </Row>
    ))}
  </div>
);

export default inject(STORE_ROOT)(observer(WalletList));
