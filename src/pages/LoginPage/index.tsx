import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Redirect} from 'react-router';
import {InjectedRootStoreProps} from '../../App';
import LoginForm from '../../components/LoginForm';
import Logo from '../../components/Logo';
import {ROUTE_WALLET} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';

export class LoginPage extends React.Component<InjectedRootStoreProps> {
  readonly authStore = this.props.rootStore!.authStore;

  render() {
    return this.authStore.isAuthenticated ? (
      <Redirect to={ROUTE_WALLET} />
    ) : (
      <div>
        <Logo />
        <LoginForm />
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(LoginPage));
