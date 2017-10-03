import {Layout} from 'antd';
import * as React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import './App.css';

const {Header, Content, Footer} = Layout;

class App extends React.Component {
  render() {
    return (
      <Router>
        <Layout className="app">
          <Header className="app__header">LykkeWallet</Header>
          <Content className="app__shell">LykkeWallet</Content>
          <Footer>&copy; 2017 Lykke, Inc.</Footer>
        </Layout>
      </Router>
    );
  }
}

export default App;
