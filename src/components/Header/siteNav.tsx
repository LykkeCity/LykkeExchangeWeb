import * as React from 'react';

export default function SiteNav() {
  return (
    <nav className="site_nav">
      <div className="site_nav__inner">
        <div className="container">
          <ul className="header_nav__list nav_list nav_list--alt">
            <li className="nav_list__item">
              <a href="/">Trading Wallet</a>
            </li>

            <li className="nav_list__item nav_list__item--active">
              <a href="/">Private Wallet</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
