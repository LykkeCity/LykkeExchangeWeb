import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute/index';
import {ThemeProvider} from './components/styled';
import theme from './components/theme';
import {ROUTE_LOGIN, ROUTE_ROOT} from './constants/routes';
import {STORE_ROOT} from './constants/stores';
import LoginPage from './pages/LoginPage/index';
import ProtectedPage from './pages/ProtectedPage/index';
import {RootStore} from './stores';

import './App.css';

export interface RootStoreProps {
  rootStore?: RootStore;
}

class App extends React.Component<RootStoreProps> {
  toggleBodyOverlay() {
    this.props.rootStore!.uiStore.overlayed
      ? document.body.classList.add('body--overlayed')
      : document.body.classList.remove('body--overlayed');
  }

  render() {
    this.toggleBodyOverlay();
    return (
      <Router>
        <ThemeProvider theme={theme}>
          <div className="app" onClick={this.handleOutsideClick}>
            <Switch>
              <Route exact={true} path={ROUTE_LOGIN} component={LoginPage} />
              <ProtectedRoute path={ROUTE_ROOT} component={ProtectedPage} />
            </Switch>
          </div>
        </ThemeProvider>
      </Router>
    );
  }

  private handleOutsideClick = (e: React.MouseEvent<any>) => {
    const {closeSidebar} = this.props.rootStore!.uiStore;
    closeSidebar();
  };
}

export default inject(STORE_ROOT)(observer(App));
