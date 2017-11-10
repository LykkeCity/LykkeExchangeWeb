import * as classNames from 'classnames';
import * as React from 'react';
import {Link, Route, withRouter} from 'react-router-dom';
import {ROUTE_WALLETS} from '../../constants/routes';
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

export const NavBar = ({match}: any) => (
  <div className="header_nav_container">
    <nav className="header_nav">
      <div className="header_nav__inner">
        <div className="container">
          <ul className="header_nav__list nav_list">
            <NavLink to={ROUTE_WALLETS} label="Wallets" />
          </ul>
          <Balance />
        </div>
      </div>
    </nav>
  </div>
);

export default withRouter(NavBar);
