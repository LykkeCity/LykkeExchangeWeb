import {Layout} from 'antd';
import {Provider} from 'mobx-react';
import * as React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import {ProtectedRoute} from './components/ProtectedRoute/index';
import {
  ROUTE_AUTH,
  ROUTE_LOGIN,
  ROUTE_TRANSFER,
  ROUTE_WALLET
} from './constants/routes';
import {LoginPage, WalletPage} from './pages';
import AuthPage from './pages/AuthPage';
import TransferPage from './pages/TransferPage/index';
import {RootStore} from './stores';

const {Content} = Layout;
const rootStore = new RootStore();

export interface InjectedRootStoreProps {
  rootStore?: RootStore;
}

class App extends React.Component {
  render() {
    return (
      <Provider rootStore={rootStore}>
        <Router>
          <Layout className="app">
            <Header />
            <Content className="app__shell">
              <ProtectedRoute
                exact={true}
                path={ROUTE_WALLET}
                Component={WalletPage}
                authStore={rootStore.authStore}
              />
              <ProtectedRoute
                exact={true}
                path={ROUTE_TRANSFER}
                Component={TransferPage}
                authStore={rootStore.authStore}
              />
              <Route exact={true} path={ROUTE_LOGIN} component={LoginPage} />
              <Route exact={true} path={ROUTE_AUTH} component={AuthPage} />
            </Content>
            <Footer />
          </Layout>
        </Router>
      </Provider>
    );
  }
}

export default App;
