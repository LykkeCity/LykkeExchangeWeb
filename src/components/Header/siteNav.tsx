import * as React from 'react';
import {Link} from 'react-router-dom';
import {ROUTE_WALLETS} from '../../constants/routes';

export default function SiteNav() {
  return (
    <nav className="site_nav">
      <div className="site_nav__inner">
        <div className="container">
          <ul className="tabs">
            <li className="tab tab--active">
              <Link to={ROUTE_WALLETS} className="tab__link">
                Trading Wallet
              </Link>
            </li>
            <li className="tab">
              <Link to={ROUTE_WALLETS} className="tab__link">
                API Wallets
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
