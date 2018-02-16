import * as classNames from 'classnames';
import * as React from 'react';
import {Link, Route} from 'react-router-dom';
import './style.css';

interface TabLinkProps {
  label: string;
  to: string;
}

interface TabPaneProps {
  to: string;
}

export const TabLink: React.SFC<TabLinkProps> = ({label, to}) => (
  <Route
    path={to}
    exact={true}
    // tslint:disable-next-line:jsx-no-lambda
    children={({match}) => (
      <div className={classNames('tab', {'tab--active': !!match})}>
        <Link to={to} className="tab__link">
          {label}
        </Link>
      </div>
    )}
  />
);

export const TabPane: React.SFC<TabPaneProps> = ({to, children}) => (
  <Route
    path={to}
    exact={true}
    // tslint:disable-next-line:jsx-no-lambda
    render={({match}) => children}
  />
);
