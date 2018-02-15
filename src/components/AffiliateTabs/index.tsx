import * as classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link, Route, withRouter} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {
  ROUTE_AFFILIATE_DETAILS,
  ROUTE_AFFILIATE_STATISTICS
} from '../../constants/routes';
import './style.css';

interface TabLinkProps {
  label: string;
  to: string;
}

interface TabPaneProps {
  to: string;
}

const TabLink: React.SFC<TabLinkProps> = ({label, to}) => (
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

const TabPane: React.SFC<TabPaneProps> = ({to, children}) => (
  <Route
    path={to}
    exact={true}
    // tslint:disable-next-line:jsx-no-lambda
    render={({match}) => children}
  />
);

export const AffiliateTabs = (props: any) => (
  <div className="wallet-tabs">
    <div className="tabs">
      <TabLink label="Statistics" to={ROUTE_AFFILIATE_STATISTICS} />
      <TabLink label="Program details" to={ROUTE_AFFILIATE_DETAILS} />
    </div>
    <TabPane to={ROUTE_AFFILIATE_STATISTICS}>
      <div className="tab__pane">
        <div className="row">
          <div className="col-sm-12">text</div>
        </div>
      </div>
    </TabPane>
    <TabPane to={ROUTE_AFFILIATE_DETAILS}>
      <div className="tab__pane">
        <div className="row">
          <div className="col-sm-12">text</div>
        </div>
      </div>
    </TabPane>
  </div>
);

export default withRouter(
  inject(({rootStore}: RootStoreProps) => ({}))(observer(AffiliateTabs))
);
