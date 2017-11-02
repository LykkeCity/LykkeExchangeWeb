import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';

export const Balance: React.SFC<RootStoreProps> = ({rootStore}) => (
  <div className="header_nav_balance pull-right">
    <div className="dropdown_control">
      <i className="icon icon--finance_alt" />
      <div className="header_nav_balance__value">
        {rootStore!.walletStore.totalBalance.toFixed(2)}
      </div>
      <div className="header_nav_balance__currency">
        {}
        <select
          value={rootStore!.profileStore.baseCurrency}
          // tslint:disable-next-line:jsx-no-lambda
          onChange={e =>
            (rootStore!.profileStore.baseCurrency = e.currentTarget.value)}
        >
          {['LKK', 'USD', 'EUR'].map(x => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
);

export default inject(STORE_ROOT)(observer(Balance));
