import * as React from 'react';

import Apps from '../Apps';
import Subscribe from '../Blocks/Subscribe';
import Copyright from '../Copyright';
import Social from '../Social';
import Nav from './nav';
import './style.css';

export default () => (
  <footer className="footer ant-row">
    <div className="footer__top">
      <div className="container">
        <div className="separator" />

        <div className="row">
          <div className="col-md-5">
            <Apps theme="left" />
            <Subscribe />
          </div>
          <div className="col-md-7">
            <Nav />
          </div>
        </div>
      </div>
    </div>

    <div className="footer__bottom">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-sm-7 pull-right">
            <Social theme="footer" />
          </div>
          <div className="col-xs-12 col-sm-5">
            <ul className="footer_links">
              <li>
                <Copyright />
              </li>
              <li className="middot">&middot;</li>
              <li>
                <a href="">Privacy Policy</a>
              </li>
              <li className="middot">&middot;</li>
              <li>
                <a href="">Terms of Use</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
);
