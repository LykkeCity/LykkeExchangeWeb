import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {InjectedRootStoreProps} from '../../App';
import LoginForm from '../../components/LoginForm';
import Logo from '../../components/Logo';
import {STORE_ROOT} from '../../constants/stores';

export class LoginPage extends React.Component<InjectedRootStoreProps> {
  readonly authStore = this.props.rootStore!.authStore;

  render() {
    return (
      <div>
        <Logo />
        <LoginForm />
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(LoginPage));
