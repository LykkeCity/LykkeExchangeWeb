import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {STORE_ROOT} from '../../constants/stores';
import {RootStore} from '../../stores';

import Apps from '../Apps';
import Subscribe from '../Blocks/Subscribe';
import Copyright from '../Copyright';
import Nav from './nav';
import './style.css';

export interface RootStoreProps {
  rootStore?: RootStore;
}

export const CookieBanner: React.SFC<RootStoreProps> = ({rootStore}) => (
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
        <div className="separator" />
        <div className="row">
          <div className="col-xs-12 col-sm-12">
            <Copyright />
            <ul className="footer_links pull-right">
              <li>
                <a href="https://www.lykke.com/privacy-policy" target="_blank">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  className="privacy-settings"
                  onClick={() =>
                    rootStore!.uiStore.setCookieBannerVisibility(true)}
                >
                  Privacy Settings
                </a>
              </li>
              <li>
                <a href="https://www.lykke.com/terms-of-use" target="_blank">
                  Terms of Use
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default inject(STORE_ROOT)(observer(CookieBanner));
