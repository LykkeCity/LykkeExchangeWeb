import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import {moneyFloor} from '../../utils';
import {asAssetBalance} from '../hoc/assetBalance';

export const Balance: React.SFC<RootStoreProps> = ({rootStore}) => {
  const {
    uiStore: {showBaseCurrencyPicker, toggleBaseAssetPicker},
    profileStore: {setBaseAsset, baseAssetAsModel},
    assetStore: {baseAssets},
    walletStore: {totalBalance}
  } = rootStore!;

  const handleClickBaseAsset = (x: any) => (e: any) => {
    setBaseAsset(x);
    toggleBaseAssetPicker();
  };

  return (
    <div className="header_nav_balance pull-right">
      <div className="dropdown_control">
        <i className="icon icon--finance_alt" />
        <div className="header_nav_balance__value">
          {!!baseAssetAsModel &&
            asAssetBalance(
              baseAssetAsModel,
              moneyFloor(totalBalance, baseAssetAsModel.accuracy)
            )}
        </div>
        <div className="header_nav_balance__currency nav_list__item">
          <a id="baseAsset" onClick={toggleBaseAssetPicker}>
            {!!baseAssetAsModel && baseAssetAsModel!.name}
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
                  onClick={handleClickBaseAsset(x)}
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
