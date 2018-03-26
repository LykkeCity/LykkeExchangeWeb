import {create, persist} from 'mobx-persist';
import {Provider} from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {IntlProvider} from 'react-intl';
import App from './App';
import {RootStore} from './stores';

export const rootElement = document.getElementById('root');

if (process.env.NODE_ENV === 'production') {
  runProduction();
} else {
  runDevelopment();
}

function runProduction() {
  const rootStore = new RootStore();
  renderApp(rootStore);
}

function runDevelopment() {
  const rootStore = new RootStore();
  const persistRootStore = persist(RootStore)(rootStore);

  const hydrate = create({
    storage: localStorage
  });

  const result = hydrate('persistRootStore', persistRootStore);
  const rehydrate = result.rehydrate;
  // tslint:disable-next-line:no-console
  result.then(() => console.log('rootStore hydrated'));

  renderApp(persistRootStore);

  if (module.hot) {
    module.hot.accept(['./App', './stores'], () => {
      // tslint:disable-next-line:no-console
      rehydrate().then(() => console.log('rootStore rehydrated'));

      renderApp(persistRootStore);
    });
  }
}

function renderApp(rootStore: any) {
  ReactDOM.render(
    <Provider rootStore={rootStore}>
      <IntlProvider locale="en">
        <App />
      </IntlProvider>
    </Provider>,
    rootElement
  );
}
