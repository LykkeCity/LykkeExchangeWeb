import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
import LoginForm from '../../components/LoginForm';
import Logo from '../../components/Logo';
import {STORE_ROOT} from '../../constants/stores';

export class LoginPage extends React.Component<RootStoreProps> {
  render() {
    return (
      <div style={{margin: '100px auto', width: '300px'}}>
        <Logo />
        <LoginForm />
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(LoginPage));
