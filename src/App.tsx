import {Layout} from 'antd';
import {Provider} from 'mobx-react';
import * as React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import Copyright from './components/Copyright';
import Login from './pages/Login';
import {RootStore} from './stores';

const {Header, Content, Footer} = Layout;

class App extends React.Component {
  render() {
    return (
      <Provider rootStore={new RootStore()}>
        <Router>
          <Layout className="app">
            <Header className="app__header">LykkeWallet</Header>
            <Content className="app__shell">
              <Route exact={true} path="/wallets" component={Wallets} />
              <Route path="/login" component={Login} />
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

const Wallets = () => <div>Wallets</div>;
