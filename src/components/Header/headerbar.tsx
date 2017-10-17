import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {InjectedRootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import Logo from '../Logo';

export const HeaderBar: React.SFC<InjectedRootStoreProps> = ({rootStore}) => {
  return (
    <div className="header_container">
      <header className="header">
        <div className="container">
          <div className="header__menu_button">
            <button className="btn btn_menu btn--icon" type="button">
              <span />
            </button>
          </div>

          <Logo />

          <div className="header__actions header_actions pull-right">
            {!!rootStore!.authStore.token && (
              <div className="header_actions__logout visible-xs pull-right">
                hey hi
                <a href="/Home/LogOut" className="btn btn--icon btn_logout">
                  <i className="icon icon--exit" />
                </a>
              </div>
            )}

            <div className="header_actions__login header_login pull-right">
              <div className="header_user dropdown__control">
                <a href={rootStore!.authStore.getConnectUrl()}>
                  <div className="header_login__title">Sign in</div>
                  {/* Для залогиненого
                    <div className="header_user__img">
                      <img src="images/user_default.svg" width="40" alt="user_image"/>
                    </div>
                    <div className="header_login__title">Leroy</div>
                    */}
                </a>
              </div>

              {/* Для залогиненого
                <div className="dropdown__container">
                  <ul className="dropdown__nav">
                    <li><a href="/Home/LogOut">Sign Out</a></li>
                  </ul>
                </div>*/}
            </div>

            <div className="header_actions__search">
              <button className="btn btn--icon btn_open_search" type="button">
                <i className="icon icon--search" />
              </button>
            </div>
          </div>

          <div className="header_search">
            <div className="container">
              <div className="header_search__inner">
                <div className="header_search__buttons">
                  <button
                    type="button"
                    className="btn btn-sm btn--flat hidden-xs btn_close_header"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn--primary hidden-xs"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    className="btn btn--icon visible-xs btn_close_header"
                  >
                    <i className="icon icon--cancel_round" />
                  </button>
                </div>
                <div className="header_search__field">
                  <button
                    className="header_search__btn btn btn--icon"
                    type="button"
                  >
                    <i className="icon icon--search" />
                  </button>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default inject(STORE_ROOT)(observer(HeaderBar));
