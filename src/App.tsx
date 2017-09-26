import {Layout} from 'antd';
import * as React from 'react';
import './App.css';

const {Header, Content, Footer} = Layout

class App extends React.Component {
  render() {
    return (
      <Layout className="app">
        <Header className="app__header">
          Lykke
        </Header>
        <Content className="app__shell">
          Lykke Exchange web app
        </Content>
        <Footer>&copy; 2017 Lykke, Inc.</Footer>
      </Layout>
    );
  }
}

export default App;
