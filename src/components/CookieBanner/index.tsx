import {Checkbox} from '@lykkecity/react-components';
import Cookies from 'js-cookie';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {STORE_ROOT} from '../../constants/stores';
import {RootStore} from '../../stores';

import './style.css';

const STATS_COOKIE_NAME = 'collect-stats';
const BANNER_HIDDEN_COOKIE_NAME = 'cookie-banner-hidden';

export interface RootStoreProps {
  rootStore?: RootStore;
}

class CookieBanner extends React.Component<RootStoreProps> {
  state = {
    statisticsCheck: false
  };

  private readonly analyticsService = this.props.rootStore!.analyticsService;
  private readonly profileStore = this.props.rootStore!.profileStore;

  componentDidMount() {
    let statisticsCheck = false;
    const statisticsCookieValue = Cookies.get(STATS_COOKIE_NAME);
    if (statisticsCookieValue === undefined) {
      statisticsCheck = true;
    } else {
      statisticsCheck = parseInt(statisticsCookieValue, 10) ? true : false;
    }
    this.setState({
      statisticsCheck
    });
    this.props.rootStore!.uiStore.setCookieBannerVisibility(
      Cookies.get(BANNER_HIDDEN_COOKIE_NAME) !== '1'
    );
  }

  getCookieConfiguration() {
    const rootDomain = this.getRootDomain();
    let domain = '';
    if (rootDomain.indexOf('localhost') > -1) {
      domain = 'localhost';
    } else {
      domain = '.' + rootDomain;
    }

    return {expires: 365, domain};
  }

  getRootDomain() {
    let url = document.location.href as any;
    url = url.replace(/(https?:\/\/)?(www.)?/i, '');
    url = url.split('.');
    url = url.slice(url.length - 2).join('.');
    if (url.indexOf('/') !== -1) {
      return url.split('/')[0];
    }
    return url;
  }

  hideBanner() {
    const config = this.getCookieConfiguration();
    Cookies.set(BANNER_HIDDEN_COOKIE_NAME, '1', config);

    this.props.rootStore!.uiStore.setCookieBannerVisibility(false);

    const {statisticsCheck} = this.state;
    if (statisticsCheck) {
      Cookies.set(STATS_COOKIE_NAME, '1', config);
      this.analyticsService.init();
      this.analyticsService.setUserId(this.profileStore.email);
    } else {
      Cookies.set(STATS_COOKIE_NAME, '0', config);
    }
  }

  render() {
    const {cookieBannerVisible} = this.props.rootStore!.uiStore;
    return cookieBannerVisible ? (
      <div className="cookie__banner">
        <div className="cookie__text">
          <div>
            We use cookies to offer you a better browsing experience and analyze
            site traffic. Necessary cookies are essential to browse the website
            and use it's features. Additional cookies are only used if you
            consent to it. They serve statistical purposes and you can always
            change your privacy settings. For more information, see our{' '}
            <a href="https://lykke.com/privacy-policy/" target="_blank">
              Privacy Policy
            </a>
            .
          </div>
        </div>
        <div className="cookie__footer">
          <div className="checkboxes">
            <Checkbox label="Necessary" checked />
            <Checkbox
              label="Statistics"
              checked={this.state.statisticsCheck}
              onToggle={() =>
                this.setState({statisticsCheck: !this.state.statisticsCheck})}
              className="stats-checkbox"
            />
          </div>
          <button
            className="btn btn--link agree-button"
            type="button"
            onClick={() => this.hideBanner()}
          >
            Apply selection and agree
          </button>
        </div>
      </div>
    ) : null;
  }
}

export default inject(STORE_ROOT)(observer(CookieBanner));
