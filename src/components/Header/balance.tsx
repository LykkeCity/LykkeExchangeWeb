import * as React from 'react';

export default function Balance() {
  return (
    <div className="header_nav_balance pull-right">
      <div className="dropdown_control">
        <i className="icon icon--finance_alt" />
        <div className="header_nav_balance__currency">
          <span>LKK</span>
        </div>
        <div className="header_nav_balance__value">103.84620625</div>
      </div>
    </div>
  );
}
