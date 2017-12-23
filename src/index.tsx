import {Provider} from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import {RootStore} from './stores';

export const rootElement = document.getElementById('root');

const rootStore = new RootStore();

function renderApp() {
  ReactDOM.render(
    <Provider rootStore={rootStore}>
      <App />
    </Provider>,
    rootElement
  );
}

renderApp();

if (module.hot) {
  module.hot.accept(['./App'], () => {
    renderApp();
  });
}
