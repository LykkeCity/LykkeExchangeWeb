import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Redirect} from 'react-router-dom';
import {InjectedRootStoreProps} from '../../App';
import LoginForm from '../../components/LoginForm';
import Logo from '../../components/Logo';
import {ROUTE_HOME} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';

export class LoginPage extends React.Component<InjectedRootStoreProps> {
  readonly authStore = this.props.rootStore!.authStore;

  render() {
    return !!this.authStore.token ? ( // FIXME: refactor to ProtectedRoute HOC
      <Redirect to={ROUTE_HOME} />
    ) : (
      <div style={{margin: '100px auto', width: '300px'}}>
        <Logo />
        <LoginForm />
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(LoginPage));
