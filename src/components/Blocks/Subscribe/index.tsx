import * as React from 'react';

import './style.css';

export default () => (
  <div className="block_subscribe">
    <h5 className="block_subscribe__title">Newsletter</h5>
    <p className="hint">Get our latest news right in your mailbox</p>

    <form className="form">
      <div className="form-group">
        <div className="input-group">
          <i className="icon icon--email"/>
          <input type="email" placeholder="E-mail address" className="form-control"/>
        </div>
        <button className="btn btn-sm btn--primary btn--circle" type="button">
          <i className="icon icon--arrow-right-alt" />
        </button>
      </div>
    </form>
  </div>
);
