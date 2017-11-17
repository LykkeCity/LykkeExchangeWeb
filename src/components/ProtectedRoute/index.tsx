import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Redirect, Route, RouteProps} from 'react-router';
import {RootStoreProps} from '../../App';
import {ROUTE_LOGIN} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';

type ProtectedRouteProps = RouteProps & RootStoreProps;

export const ProtectedRoute = ({rootStore, ...rest}: ProtectedRouteProps) => {
  const {authStore: {isAuthenticated}} = rootStore!;
  return isAuthenticated ? <Route {...rest} /> : <Redirect to={ROUTE_LOGIN} />;
};

export default inject(STORE_ROOT)(observer(ProtectedRoute));
