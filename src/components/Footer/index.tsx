import {inject} from 'mobx-react';
import * as React from 'react';
import {withRouter} from 'react-router';
import {RootStoreProps} from '../../App';

import Apps from '../Apps';
import Subscribe from '../Blocks/Subscribe';
import Copyright from '../Copyright';
import Social from '../Social';
import Nav from './nav';
import './style.css';

export const Footer = ({labels}: any) => (
  <footer className="footer">
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
                <a href="https://www.lykke.com/privacy_policy" target="_blank">
                  {labels.PrivacyPolicy}
                </a>
              </li>
              <li className="middot">&middot;</li>
              <li>
                <a href="https://www.lykke.com/terms_of_use" target="_blank">
                  {labels.TermsOfUse}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default withRouter(
  inject(({rootStore}: RootStoreProps) => ({
    labels: rootStore!.localizationStore.i18nFooter
  }))(Footer)
);
