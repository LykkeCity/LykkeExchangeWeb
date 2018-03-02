import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Route, RouteProps} from 'react-router';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';

type ProtectedRouteProps = RouteProps & RootStoreProps;

export const ProtectedRoute = ({rootStore, ...rest}: ProtectedRouteProps) => {
  const {authStore: {isAuthenticated, signIn}} = rootStore!;
  if (!isAuthenticated) {
    signIn();
    return null;
  }

  return <Route {...rest} />;
};

export default inject(STORE_ROOT)(observer(ProtectedRoute));
