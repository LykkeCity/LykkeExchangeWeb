import * as React from 'react';
import {Link} from 'react-router-dom';

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
                {/* <a href="/exchange">Wallets</a> */}
                {/* <menu className="header_nav__submenu submenu">
                  <ul className="submenu_list">
                    <li className="submenu_list__item"><a href="">LykkeX Rulebook</a></li>
                    <li className="submenu_list__item"><a href="">Terms of Issuance</a></li>
                    <li className="submenu_list__item"><a href="">LykkeX API</a></li>
                    <li className="submenu_list__item"><a href="">Github</a></li>
                    <li className="submenu_list__item"><a href="">White Paper</a></li>
                  </ul>
                </menu> */}
              </li>
              <li className="nav_list__item">
                <Link to="/exchange">Exchange</Link>
                {/* <a href="/community">Community</a>
                <menu className="header_nav__submenu submenu">
                  <ul className="submenu_list">
                    <li className="submenu_list__item">
                      <a href="">FAQ</a>
                    </li>
                    <li className="submenu_list__item">
                      <a href="">Open Positions</a>
                    </li>
                    <li className="submenu_list__item">
                      <a href="">Blog</a>
                    </li>
                  </ul>
                </menu> */}
              </li>
              <li className="nav_list__item">
                <Link to="/history">History</Link>
                {/* <a href="/community">Company</a>
                <menu className="header_nav__submenu submenu">
                  <ul className="submenu_list">
                    <li className="submenu_list__item">
                      <a href="">Core team</a>
                    </li>
                    <li className="submenu_list__item">
                      <a href="">Technology</a>
                    </li>
                    <li className="submenu_list__item">
                      <a href="">Contacts</a>
                    </li>
                    <li className="submenu_list__item">
                      <a href="">News</a>
                    </li>
                    <li className="submenu_list__item">
                      <a href="">Invest</a>
                    </li>
                  </ul>
                </menu> */}
              </li>
              <li className="nav_list__item">
                <Link to="/my">My Lykke</Link>
                {/* <a href="/b2b">Accelerator</a>
                <menu className="header_nav__submenu submenu">
                  <ul className="submenu_list">
                    <li className="submenu_list__item">
                      <a href="">Deploy Blockchain Projects</a>
                    </li>
                    <li className="submenu_list__item">
                      <a href="">Join as Blockchain Accelerator</a>
                    </li>
                  </ul>
                </menu> */}
              </li>
              {/* <li className="nav_list__item">
                <a href="/b2b">Ico platform</a>
                <menu className="header_nav__submenu submenu">
                  <ul className="submenu_list">
                    <li className="submenu_list__item">
                      <a href="">Apply for an ICO</a>
                    </li>
                    <li className="submenu_list__item">
                      <a href="">FAQ</a>
                    </li>
                  </ul>
                </menu>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
