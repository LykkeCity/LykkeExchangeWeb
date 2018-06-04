import * as React from 'react';

export default function Nav() {
  return (
    <div className="footer_nav">
      <div className="footer_nav__row">
        <div className="footer_nav__col">
          <menu className="nav nav--list">
            <li className="nav__title">Services</li>
            <li>
              <a href="https://lykke.com/exchange">Exchange</a>
            </li>
            <li>
              <a href="https://lykke.com/lykke_api">API</a>
            </li>
            <li>
              <a href="https://wallet.lykke.com/">API deposits</a>
            </li>
            <li>
              <a href="https://lykke.com/apply-ico">Listing</a>
            </li>
          </menu>
        </div>
        <div className="footer_nav__col">
          <menu className="nav nav--list">
            <li className="nav__title">About</li>
            <li>
              <a href="https://lykke.com/leadership">Core team</a>
            </li>
            <li>
              <a href="https://lykke.com/city/faq">FAQ</a>
            </li>
            <li>
              <a href="https://lykke.com/city/invest">Invest</a>
            </li>
            <li>
              <a href="https://lykke.com/company/news">News</a>
            </li>
            <li>
              <a href="https://lykke.com/city/blog">Blog</a>
            </li>
          </menu>
        </div>
        <div className="footer_nav__col">
          <menu className="nav nav--list">
            <li className="nav__title">Contribute</li>
            <li>
              <a href="https://github.com/LykkeCity/">Github</a>
            </li>
            <li>
              <a href="https://streams.lykke.com/">Streams</a>
            </li>
            <li>
              <a href="https://lykke.com/city/open_positions">Career</a>
            </li>
          </menu>
        </div>
        <div className="footer_nav__col">
          <menu className="nav nav--list">
            <li className="nav__title">Get in touch</li>
            <li>
              <a href="https://lykke.com/contacts">Contacts</a>
            </li>
            <li>
              <a href="https://lykkex.zendesk.com">Help center</a>
            </li>
          </menu>
        </div>
      </div>
    </div>
  );
}
