import * as React from 'react';

export default function Nav() {
  return (
    <div className="footer_nav">
      <div className="footer_nav__row">
        <div className="footer_nav__col">
          <menu className="nav nav--list">
            <li className="nav__title">Services</li>
            <li><a href="https://streams.lykke.com/" target="_blank">Lykke Streams</a></li>
            <li><a href="https://blockchainexplorer.lykke.com/" target="_blank">Blockchain Explorer</a></li>
            <li><a href="https://lykke.com/ico-platform">ICO Platform</a></li>
          </menu>
        </div>
        <div className="footer_nav__col">
          <menu className="nav nav--list">
            <li className="nav__title">For clients</li>
            <li><a href="https://lykke.com/city/invest">Invest</a></li>
            <li><a href="https://lykke.com/">Wallet</a></li>
            <li><a href="https://lykke.com/exchange">Exchange</a></li>
            <li><a href="https://lykke.com/b2b">Accelerator</a></li>
            <li><a href="https://lykke.com/city/faq">FAQ</a></li>
          </menu>
        </div>
        <div className="footer_nav__col">
          <menu className="nav nav--list">
            <li className="nav__title">About us</li>
            <li><a href="https://lykke.com/leadership">Core team</a></li>
            <li><a href="https://lykke.com/technology">Technology</a></li>
            <li><a href="https://lykke.com/company/news">News</a></li>
            <li><a href="https://lykke.com/city/blog">Blog</a></li>
            <li><a href="https://lykke.com/media/Whitepaper_LykkeExchange.pdf">White Paper</a></li>
          </menu>
        </div>
        <div className="footer_nav__col">
          <menu className="nav nav--list">
            <li className="nav__title">Get in touch</li>
            <li><a href="https://lykke.com/contacts">Contacts</a></li>
            <li><a href="mailto:support@lykke.com">Support</a></li>
            <li><a href="https://lykke.com/city/open_positions">Open positions</a></li>
            <li><a href="https://lykke.com/b2b-join">Join as Blockchain Accelerator</a></li>
          </menu>
        </div>
      </div>
    </div>
  )
}
