import {
  Dropdown,
  DropdownContainer,
  DropdownControl,
  DropdownList,
  DropdownListItem
} from 'lykke-react-components';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';

export const UserInfo: React.SFC<RootStoreProps> = ({rootStore}) => {
  const {authStore, profileStore} = rootStore!;

  return (
    <div className="header__actions header_actions__login header_login pull-right">
      <Dropdown>
        <DropdownControl>
          <div className="header_user__img">
            <img
              src={`${process.env.PUBLIC_URL}/images/user_default.svg`}
              width="40"
              alt="user_image"
            />
          </div>
          <div className="header_login__title">{profileStore.fullName}</div>
        </DropdownControl>
        <DropdownContainer>
          <DropdownList>
            <DropdownListItem>
              <a onClick={authStore.signOut}>Sign out</a>
            </DropdownListItem>
          </DropdownList>
        </DropdownContainer>
      </Dropdown>
    </div>
  );
};

export default inject(STORE_ROOT)(observer(UserInfo));
