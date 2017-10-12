import * as classnames from 'classnames';
import * as React from 'react';

import './style.css';

export const APPSTORE_LINK = 'https://appsto.re/ru/Dwjvcb.i';
export const GOOGLEPLAY_LINK =
  'https://play.google.com/store/apps/details?id=com.lykkex.LykkeWallet';

const APPS_CLASS_NAME = 'apps';

export default ({theme}: any) => (
  <div
    className={classnames(APPS_CLASS_NAME, {
      [APPS_CLASS_NAME + '--' + theme]: theme
    })}
  >
    <div className="apps_apple">
      <a href={APPSTORE_LINK} target="_blank" rel="noopener noreferrer">
        <img src="images/appstore-badge.svg" width="170" alt="apps_apple" />
      </a>
    </div>
    <div className="apps_google">
      <a href={GOOGLEPLAY_LINK} target="_blank" rel="noopener noreferrer">
        <img src="images/google-play.svg" width="170" alt="apps_google" />
      </a>
    </div>
  </div>
);
