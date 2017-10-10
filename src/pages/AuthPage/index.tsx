import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Redirect} from 'react-router-dom';
import {InjectedRootStoreProps} from '../../App';
import {ROUTE_WALLET} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {authUtils} from '../../utils';

export class AuthPage extends React.Component<InjectedRootStoreProps> {
  private readonly authStore = this.props.rootStore!.authStore;

  componentWillMount() {
    const code = new URL(location.href).searchParams.get('code');
    authUtils.getToken(code!).then((resp: any) => {
      const token = resp.access_token;
      if (!!token) {
        this.authStore.isAuthenticated = true;
        this.props.rootStore!.tokenStore.set(token);
      }
    });
  }

  render() {
    return this.authStore.isAuthenticated ? (
      <Redirect to={ROUTE_WALLET} />
    ) : null;
  }
}

export default inject(STORE_ROOT)(observer(AuthPage));
