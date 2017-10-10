import {Icon, Layout} from 'antd';
import Avatar from 'antd/lib/avatar';
import Col from 'antd/lib/grid/col';
import Row from 'antd/lib/grid/row';
import Menu from 'antd/lib/menu';
import {Provider} from 'mobx-react';
import * as React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import Copyright from './components/Copyright';
import Logo from './components/Logo';
import Social from './components/Social';
import {ROUTE_AUTH, ROUTE_LOGIN, ROUTE_WALLET} from './constants/routes';
import {LoginPage, WalletPage} from './pages';
import AuthPage from './pages/AuthPage';
import {RootStore} from './stores';

const {Header, Content, Footer} = Layout;
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
            <Header className="app__header">
              <Row type="flex" align="middle">
                <Col span={12}>
                  <Logo color="#fefefe" />
                </Col>
                <Col span={4} offset={8}>
                  <Icon type="search" style={{fontSize: '18px'}} />&nbsp;
                  <Icon type="bell" style={{fontSize: '18px'}} />&nbsp;
                  <Avatar size="large" icon="user" />&nbsp;Leroy
                </Col>
              </Row>
            </Header>
            <Content className="app__shell">
              <Menu mode="horizontal">
                <Menu.Item>Wallets</Menu.Item>
                <Menu.Item>Exchange</Menu.Item>
                <Menu.Item>History</Menu.Item>
                <Menu.Item>My Lykke</Menu.Item>
              </Menu>
              <Route exact={true} path={ROUTE_WALLET} component={WalletPage} />
              <Route exact={true} path={ROUTE_LOGIN} component={LoginPage} />
              <Route exact={true} path={ROUTE_AUTH} component={AuthPage} />
            </Content>
            <Footer>
              <Row>
                <Col span={12}>
                  <Copyright />
                </Col>
                <Col span={12} style={{textAlign: 'right'}}>
                  <Social />
                </Col>
              </Row>
            </Footer>
          </Layout>
        </Router>
      </Provider>
    );
  }
}

export default App;
