import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import {NumberFormat} from '../NumberFormat';

export const Balance: React.SFC<RootStoreProps> = ({rootStore}) => {
  const {
    uiStore: {showBaseCurrencyPicker, toggleBaseAssetPicker},
    profileStore: {setBaseAsset, baseAsset},
    assetStore: {baseAssets},
    walletStore: {totalBalance}
  } = rootStore!;

  const handleClickBaseAsset = (x: string) => (e: any) => {
    setBaseAsset(x);
    toggleBaseAssetPicker();
  };

  return (
    <div className="header_nav_balance pull-right">
      <div className="dropdown_control">
        <i className="icon icon--finance_alt" />
        <div className="header_nav_balance__value">
          <NumberFormat value={totalBalance} />
        </div>
        <div className="header_nav_balance__currency nav_list__item">
          <a id="baseAsset" onClick={toggleBaseAssetPicker}>
            {baseAsset}
          </a>
          <menu
            className="submenu"
            style={
              showBaseCurrencyPicker
                ? {visibility: 'visible', opacity: 1}
                : {visibility: 'hidden', opacity: 0}
            }
          >
            <ul className="submenu_list">
              {baseAssets.map(x => (
                <li
                  key={x.id}
                  value={x.name}
                  className="submenu_list__item"
                  onClick={handleClickBaseAsset(x.name)}
                >
                  <a>{x.name}</a>
                </li>
              ))}
            </ul>
          </menu>
        </div>
      </div>
    </div>
  );
};

export default inject(STORE_ROOT)(observer(Balance));
