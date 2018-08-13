import {Header as LykkeHeader} from '@lykkex/react-components';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';

import './style.css';

export const Header: React.SFC<RootStoreProps> = ({rootStore}) => {
  const {authStore, profileStore} = rootStore!;

  return (
    <LykkeHeader
      onLogout={authStore.signOut}
      userName={profileStore.fullName}
      email={profileStore.email}
      activeMenuItem="funds"
    />
  );
};

export default inject(STORE_ROOT)(observer(Header));
