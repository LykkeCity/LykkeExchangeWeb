import * as React from 'react';

import './style.css';

export default () => (
  <section className="subscribe">
    <div className="row">
      <div className="subscribe-header">
        <img
          src={`${process.env.PUBLIC_URL}/images/newsletter-icn.svg`}
          width="30"
          alt="Newsletter"
        />
        <span className="subscribe-header__title">Newsletter</span>
      </div>
      <p className="hint">Get our latest news right in your mailbox</p>

      <form className="form">
        <div className="form-group">
          <div className="input-group">
            <i className="icon icon--email" />
            <input
              type="email"
              placeholder="E-mail address"
              className="form-control"
            />
          </div>
          <button className="btn btn-sm btn--primary btn--circle" type="button">
            <i className="icon icon--arrow-right-alt" />
          </button>
        </div>
      </form>
    </div>
  </section>
);
