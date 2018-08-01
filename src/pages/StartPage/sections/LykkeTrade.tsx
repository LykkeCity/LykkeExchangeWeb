import React from 'react';

const LykkeTradeSection: React.SFC = () => (
  <section className="lykke-trade-section">
    <div className="row">
      <div className="product-logo">
        <img
          src={`${process.env.PUBLIC_URL}/images/lykke_trade_logo.svg`}
          alt="lykke_trade_logo"
          width="60"
        />
      </div>
      <div className="product-details">
        <div className="product-details__header">Lykke Trade</div>
        <div className="product-details__short-description">Web-terminal</div>
      </div>
    </div>
    <div className="product-description">
      The Lykke Wallet mobile application for iOS and Android is the key element
      of the Lykke trading ecosystem. Our wallet app makes it easy for you to
      trade currencies and cryptocurrencies, with complete support for margin
      trading. You can buy and sell assets such as bitcoin and ether on the
      open-source Lykke Exchange, our next-generation trading platform built on
      top of blockchains.
    </div>
    <div className="product-links">
      <a href="http://trade.lykke.com" target="_blank">
        Go trade
      </a>
    </div>
    <div className="product-image">
      <img
        src={`${process.env.PUBLIC_URL}/images/lykke-trade-laptop.png`}
        alt="Lykke Trade"
      />
    </div>
  </section>
);

export default LykkeTradeSection;
