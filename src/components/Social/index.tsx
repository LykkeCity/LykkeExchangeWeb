import * as classnames from 'classnames';
import * as React from 'react';

import {Icon} from '../Icon';
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
        href="https://www.facebook.com/LykkeCity"
        target="_blank"
        className="social__item"
      >
        <Icon name="fb_simple" size="18px" />
      </a>
    </li>
    <li>
      <a
        href="https://twitter.com/LykkeCity"
        target="_blank"
        className="social__item"
      >
        <Icon name="tw" size="18px" />
      </a>
    </li>
    <li>
      <a
        href="http://instagram.com/lykkecity"
        target="_blank"
        className="social__item"
      >
        <Icon name="instagram" size="18px" />
      </a>
    </li>
    <li>
      <a
        href="https://www.youtube.com/c/LykkeX"
        target="_blank"
        className="social__item"
      >
        <Icon name="youtube" size="18px" />
      </a>
    </li>
    <li>
      <a
        href="https://www.linkedin.com/company/lykke"
        target="_blank"
        className="social__item"
      >
        <Icon name="linkedin" size="18px" />
      </a>
    </li>
    <li>
      <a
        href="https://www.reddit.com/r/lykke/"
        target="_blank"
        className="social__item"
      >
        <Icon name="reddit" size="18px" />
      </a>
    </li>
    <li>
      <a
        href="https://t.co/TmjMYnQD7T"
        target="_blank"
        className="social__item"
      >
        <Icon name="telegram" size="18px" />
      </a>
    </li>
    <li>
      <a
        href="http://lykkecommunity.herokuapp.com"
        target="_blank"
        className="social__item"
      >
        <Icon name="slack" size="18px" />
      </a>
    </li>
  </ul>
);
