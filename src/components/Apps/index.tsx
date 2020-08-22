import * as classnames from 'classnames';
import * as React from 'react';

import './style.css';

export const APPSTORE_LINK = 'https://itunes.apple.com/de/app/id1112839581/';
export const GOOGLEPLAY_LINK =
  'https://play.google.com/store/apps/details?id=com.lykkex.LykkeWallet';

const APPS_CLASS_NAME = 'apps';

export default ({theme}: any) => (
  <div
    className={classnames(APPS_CLASS_NAME, {
      [APPS_CLASS_NAME + '--' + theme]: theme
    })}
  />
);
