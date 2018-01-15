import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_LOGIN} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import Logo from '../Logo';
import {MenuButton} from './';
import HeaderSearch from './headerSearch';
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
          <MenuButton onToggle={handleToggleSidebar} />

          <Logo />

          {authStore.isAuthenticated && <UserInfo />}

          {!authStore.isAuthenticated && (
            <div className="header_actions__login header_login pull-right">
              <div className="header_user dropdown__control">
                <Link to={ROUTE_LOGIN}>
                  <div className="header_login__title">Sign in</div>
                </Link>
              </div>
            </div>
          )}
        </div>

        <HeaderSearch />
      </header>
    </div>
  );
};

export default inject(STORE_ROOT)(observer(HeaderBar));
