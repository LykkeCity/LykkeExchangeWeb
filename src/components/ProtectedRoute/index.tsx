import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Route, RouteProps} from 'react-router';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';

const AbsoluteRedirect = ({to}: {to: string}) => {
  location.replace(to);
  return null;
};

type ProtectedRouteProps = RouteProps & RootStoreProps;

export const ProtectedRoute = ({rootStore, ...rest}: ProtectedRouteProps) =>
  !!rootStore!.authStore.token ? (
    <Route {...rest} />
  ) : (
    <AbsoluteRedirect to={rootStore!.authStore.getConnectUrl()} />
  );

export default inject(STORE_ROOT)(observer(ProtectedRoute));
