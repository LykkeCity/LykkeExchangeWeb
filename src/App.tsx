import classnames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import {ROUTE_AUTH, ROUTE_ROOT} from './constants/routes';
import {STORE_ROOT} from './constants/stores';
import AuthPage from './pages/AuthPage';
import ProtectedPage from './pages/ProtectedPage/index';
import {RootStore} from './stores';

import {computed} from 'mobx';
import './App.css';

export interface RootStoreProps {
  rootStore?: RootStore;
}

class App extends React.Component<RootStoreProps> {
  @computed
  private get classes() {
    return {
      app: true,
      'app--overlayed': this.props.rootStore!.uiStore.overlayed
    };
  }

  render() {
    return (
      <Router>
        <div className={classnames(this.classes)}>
          <Header />
          <Switch>
            <Route path={ROUTE_AUTH} component={AuthPage} />
            <Route path={ROUTE_ROOT} component={ProtectedPage} />
          </Switch>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default inject(STORE_ROOT)(observer(App));
