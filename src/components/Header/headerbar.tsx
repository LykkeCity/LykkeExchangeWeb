import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import Logo from '../Logo';
import HeaderSearch from './headerSearch';
import Language from './language';
import UserInfo from './userInfo';

export const HeaderBar: React.SFC<RootStoreProps> = ({rootStore}) => {
  const {authStore, uiStore} = rootStore!;

  const handleToggleSidebar = (e: React.SyntheticEvent<any>) => {
    e.stopPropagation();
    uiStore.toggleSidebar();
  };

  return (
    <div className="header_container">
      <header className="header">
        <div className="container">
          <div className="header__menu_button">
            <button
              className="btn btn_menu btn--icon"
              type="button"
              onClick={handleToggleSidebar}
            >
              <span />
            </button>
          </div>

          <Logo />
          <Language />
          {authStore.isAuthenticated && <UserInfo />}
        </div>

        <HeaderSearch />
      </header>
    </div>
  );
};

export default inject(STORE_ROOT)(observer(HeaderBar));
