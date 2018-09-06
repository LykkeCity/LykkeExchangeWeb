import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_ROOT} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';

type AuthPageProps = RootStoreProps & RouteComponentProps<any>;

export class AuthPage extends React.Component<AuthPageProps> {
  private readonly authStore = this.props.rootStore!.authStore;

  componentDidMount() {
    this.authStore.fetchToken().then(() => this.props.history.push(ROUTE_ROOT));
  }

  render() {
    return null;
  }
}

export default inject(STORE_ROOT)(observer(AuthPage));
