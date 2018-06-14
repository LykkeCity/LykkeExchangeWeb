import * as classNames from 'classnames';
import {inject} from 'mobx-react';
import * as React from 'react';
import {withRouter} from 'react-router';
import {Link, Route} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {
  ROUTE_AFFILIATE,
  ROUTE_TRANSFER_BASE,
  ROUTE_WALLETS
} from '../../constants/routes';
import Balance from './balance';

const classes = (className: string, active: boolean) => {
  const activeClassName = `${className}--active`;
  return classNames(className, {[activeClassName]: active});
};

interface NavLinkProps {
  to: string;
  label: string;
}

const NavLink: React.SFC<NavLinkProps> = ({label, to}) => (
  <Route
    path={to}
    // tslint:disable-next-line:jsx-no-lambda
    children={({match}) => (
      <li className={classes('nav_list__item', !!match)}>
        <Link to={to}>{label}</Link>
      </li>
    )}
  />
);

export const NavBar = ({match, isAuthenticated, hasAffiliate, labels}: any) => {
  return (
    isAuthenticated && (
      <div className="header_nav_container">
        <nav className="header_nav">
          <div className="header_nav__inner">
            <div className="container">
              <ul className="header_nav__list nav_list">
                <NavLink to={ROUTE_WALLETS} label="{labels.Wallets}" />
                <NavLink to={ROUTE_TRANSFER_BASE} label="{labels.Transfer}" />
                {hasAffiliate && (
                  <NavLink to={ROUTE_AFFILIATE} label="Affiliate Program" />
                )}
              </ul>
              <Balance />
            </div>
          </div>
        </nav>
      </div>
    )
  );
};

export default withRouter(
  inject(({rootStore}: RootStoreProps) => ({
    hasAffiliate: rootStore!.featureStore.hasAffiliate,
    isAuthenticated: rootStore!.authStore.isAuthenticated,
    labels: rootStore!.localizationStore.i18nNavBarView
  }))(NavBar)
);
