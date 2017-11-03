import * as React from 'react';
import {Link} from 'react-router-dom';

import Balance from './balance';

export default function NavBar() {
  return (
    <div className="header_nav_container">
      <nav className="header_nav">
        <div className="header_nav__inner">
          <div className="container">
            <ul className="header_nav__list nav_list">
              <li className="nav_list__item">
                <Link to="/wallets" title="Wallets">
                  Wallets
                </Link>
              </li>
            </ul>
            <Balance />
          </div>
        </div>
      </nav>
    </div>
  );
}
