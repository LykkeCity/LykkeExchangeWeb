import * as React from 'react';
import {Redirect, Route, RouteProps} from 'react-router';
import {ROUTE_LOGIN} from '../../constants/routes';
import {AuthStore} from '../../stores/index';

interface ProtectedRouteProps extends RouteProps {
  Component: React.ComponentClass<any> | React.SFC<any>;
  authStore: AuthStore;
}

export const ProtectedRoute = ({
  Component,
  authStore,
  ...rest
}: ProtectedRouteProps) => (
  <Route
    {...rest}
    // tslint:disable-next-line:jsx-no-lambda
    component={(props: any) =>
      !!authStore.token ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: ROUTE_LOGIN,
            state: {from: props.location}
          }}
        />
      )}
  />
);

export default ProtectedRoute;
