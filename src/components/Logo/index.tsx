import * as React from 'react';

export default ({color}: any) => (
  <div className="header__logo header_logo">
    <a href="/">
      <img
        className="header_logo__img"
        src={`${process.env.PUBLIC_URL}/images/swisschain-footer.svg`}
        height="36"
        alt="lykke_wallet_logo"
      />
      <div className="header_logo__title">
        Swisschain<span>Wallet</span>
      </div>
    </a>
  </div>
);
