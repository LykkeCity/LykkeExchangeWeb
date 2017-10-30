import Dropdown from 'antd/lib/dropdown/dropdown';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';

export const UserInfo: React.SFC<RootStoreProps> = ({rootStore}) => {
  const {authStore} = rootStore!;
  return (
    <div className="header__actions header_actions__login header_login pull-right">
      <div className="header_user dropdown__control">
        <div className="header_user__img">
          <img
            src={`${process.env.PUBLIC_URL}/images/user_default.svg`}
            width="40"
            alt="user_image"
          />
        </div>
        <Dropdown
          overlay={
            <ul className="dropdown__nav">
              <li>
                <a onClick={authStore.logout}>Sign out</a>
              </li>
            </ul>
          }
          trigger={['click']}
          className="dropdown__container"
          placement="bottomRight"
        >
          <div className="header_login__title">Leroy</div>
        </Dropdown>
      </div>
    </div>
  );
};

export default inject(STORE_ROOT)(observer(UserInfo));
