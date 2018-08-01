import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Route, RouteProps} from 'react-router';
import {RootStoreProps} from '../../App';
import {STORE_ROOT} from '../../constants/stores';
import StartPage from '../../pages/StartPage/index';

type ProtectedRouteProps = RouteProps & RootStoreProps;

export const ProtectedRoute = ({rootStore, ...rest}: ProtectedRouteProps) => {
  const {authStore: {isAuthenticated}} = rootStore!;
  if (!isAuthenticated) {
    return <Route exact={true} component={StartPage} />;
  }

  return <Route {...rest} />;
};

export default inject(STORE_ROOT)(observer(ProtectedRoute));
