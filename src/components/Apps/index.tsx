import * as classnames from 'classnames';
import * as React from 'react';

import {config} from '../../config';
import './style.css';

const APPS_CLASS_NAME = 'apps';

export default ({theme}: any) => (
  <div
    className={classnames(APPS_CLASS_NAME, {
      [APPS_CLASS_NAME + '--' + theme]: theme
    })}
  >
    <div className="apps_apple">
      <a
        href={config.common.appStoreLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="images/appstore-badge.svg" width="170" alt="apps_apple" />
      </a>
    </div>
    <div className="apps_google">
      <a
        href={config.common.appStoreLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="images/google-play.svg" width="170" alt="apps_google" />
      </a>
    </div>
  </div>
);
