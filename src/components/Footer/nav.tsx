import * as React from 'react';

export default function Nav() {
  return (
    <div className="footer_nav">
      <div className="footer_nav__row">
        <div className="footer_nav__col">
          <menu className="nav nav--list">
            <li className="nav__title">Products</li>
            <li>
              <a href="https://wallet.lykke.com">Lykke Wallet</a>
            </li>
            <li>
              <a href="https://trade.lykke.com">Lykke Trade</a>
            </li>
          </menu>
          <menu className="nav nav--list">
            <li className="nav__title">For clients</li>
            <li>
              <a href="https://lykke.com/cp/wallet-fees-and-limits">Fees</a>
            </li>
            <li>
              <a href="https://lykke.com/cp/api-wallet-trading-rules-fees-limits">
                HFT limits
              </a>
            </li>
            <li>
              <a href="https://lykke.com/apply-ico">Listing</a>
            </li>
            <li>
              <a href="https://lykke.com/city/faq">FAQ</a>
            </li>
          </menu>
        </div>

        <div className="footer_nav__col">
          <menu className="nav nav--list">
            <li className="nav__title">Company</li>
            <li>
              <a href="https://lykke.com/leadership">Core team</a>
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
          <menu className="nav nav--list">
            <li className="nav__title">API</li>
            <li>
              <a href="https://lykkecity.github.io/Trading-API">
                Trading API documentation
              </a>
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
            <li className="nav__title">Social</li>
            <li>
              <a href="https://www.facebook.com/LykkeCity">Facebook</a>
            </li>
            <li>
              <a href="https://twitter.com/lykke">Twitter</a>
            </li>
            <li>
              <a href="http://instagram.com/lykkecity">Instagram</a>
            </li>
            <li>
              <a href="https://www.youtube.com/c/LykkeX">Youtube</a>
            </li>
            <li>
              <a href="https://www.linkedin.com/company/lykke-ag">Linkedin</a>
            </li>
            <li>
              <a href="https://www.reddit.com/r/lykke/">Reddit</a>
            </li>
            <li>
              <a href="https://t.co/TmjMYnQD7T">Telegram</a>
            </li>
            <li>
              <a href="https://t.me/LykkeDev" rel="noopener noreferrer">
                Telegram DEV
              </a>
            </li>
            <li>
              <a href="https://lykke.com/cp/rss">RSS</a>
            </li>
          </menu>
        </div>
      </div>
    </div>
  );
}
