import * as classnames from 'classnames';
import * as React from 'react';

import './style.css';

const SOCIAL_CLASS_NAME = 'social';

export default ({theme}: any) => (
  <ul
    className={classnames(SOCIAL_CLASS_NAME, {
      [SOCIAL_CLASS_NAME + '--' + theme]: theme
    })}
  >
    <li>
      <a
        href="https://www.linkedin.com/company/open-chain-ag/"
        target="_blank"
        className="social__item"
      >
        <i className="icon icon--linkedin" />
      </a>
    </li>
  </ul>
);
