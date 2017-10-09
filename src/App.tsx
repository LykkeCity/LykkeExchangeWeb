import {Layout} from 'antd';
import {Provider} from 'mobx-react';
import * as React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import Copyright from './components/Copyright';
import Logo from './components/Logo';
import {ROUTE_LOGIN, ROUTE_WALLET} from './constants/routes';
import {LoginPage, WalletPage} from './pages/';
import {RootStore} from './stores';

const {Header, Content, Footer} = Layout;

class App extends React.Component {
  render() {
    return (
      <Provider rootStore={new RootStore()}>
        <Router>
          <Layout className="app">
            <Header className="app__header">
              <Logo color="#fefefe" />
            </Header>
            <Content className="app__shell">
              <Route exact={true} path={ROUTE_WALLET} component={WalletPage} />
              <Route path={ROUTE_LOGIN} component={LoginPage} />
            </Content>
            <Footer>
              <Copyright />
            </Footer>
          </Layout>
        </Router>
      </Provider>
    );
  }
}

export default App;
