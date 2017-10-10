import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Redirect} from 'react-router-dom';
import {InjectedRootStoreProps} from '../../App';
import {ROUTE_WALLET} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {AuthUtils} from '../../utils';

export class AuthPage extends React.Component<InjectedRootStoreProps> {
  private readonly authStore = this.props.rootStore!.authStore;

  componentWillMount() {
    const code = new URL(location.href).searchParams.get('code');
    (async () => {
      const resp = await AuthUtils.getToken(code!);
      const token = resp.access_token;
      if (!!token) {
        this.authStore.setToken(token);
      }
    })();
  }

  render() {
    return this.authStore.token ? <Redirect to={ROUTE_WALLET} /> : null;
  }
}

export default inject(STORE_ROOT)(observer(AuthPage));
