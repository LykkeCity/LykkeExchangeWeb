import * as React from 'react';
import './style.css';

export default function WalletTabs() {
  return (
    <div className="wallet-tabs tabs">
      <div className="tab tab--active">
        <a className="tab__link">Trading</a>
      </div>
      <div className="tab">
        <a className="tab__link">Private</a>
      </div>
    </div>
  );
}
