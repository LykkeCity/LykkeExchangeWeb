import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute/index';
import {ROUTE_AUTH, ROUTE_ROOT} from './constants/routes';
import {STORE_ROOT} from './constants/stores';
import AuthPage from './pages/AuthPage';
import ProtectedPage from './pages/ProtectedPage/index';
import {RootStore} from './stores';

import './App.css';

export interface RootStoreProps {
  rootStore?: RootStore;
}

class App extends React.Component<RootStoreProps> {
  render() {
    return (
      <Router>
        <Switch>
          <Route path={ROUTE_AUTH} component={AuthPage} />
          <ProtectedRoute path={ROUTE_ROOT} component={ProtectedPage} />
        </Switch>
      </Router>
    );
  }
}

export default inject(STORE_ROOT)(observer(App));
