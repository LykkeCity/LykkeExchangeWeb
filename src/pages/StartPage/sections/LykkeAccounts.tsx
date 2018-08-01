import React from 'react';
import Apps from '../../../components/Apps';

const LykkeAccountsSection: React.SFC = () => (
  <section className="lykke-accounts-section">
    <div className="row">
      <div className="product-logo">
        <img
          src={`${process.env.PUBLIC_URL}/images/lykke_wallet_logo.svg`}
          alt="lykke_wallet_logo"
          width="60"
        />
      </div>
      <div className="product-details">
        <div className="product-details__header">Lykke Accounts</div>
        <div className="product-details__short-description">
          Works on{' '}
          <img
            src={`${process.env.PUBLIC_URL}/images/apple-grey-icn.svg`}
            alt="App Store"
          />{' '}
          iOS,{' '}
          <img
            src={`${process.env.PUBLIC_URL}/images/android-grey-icn.svg`}
            alt="Google Play"
          />{' '}
          Android and in the browser
        </div>
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
      <Apps />
      <div className="product-links__note">
        iOS 8.0+ and Android 4.4.2+ required
      </div>
    </div>
    <div className="product-image">
      <img
        src={`${process.env.PUBLIC_URL}/images/lykke-wallet-phone.png`}
        alt="Lykke Accounts"
      />
    </div>
  </section>
);

export default LykkeAccountsSection;
