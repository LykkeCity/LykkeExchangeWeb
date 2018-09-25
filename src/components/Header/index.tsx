import {Header as LykkeHeader, MenuItem} from '@lykkex/react-components';
import classnames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link, Route} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {
  ROUTE_PROFILE,
  ROUTE_SECURITY,
  ROUTE_WALLETS_HFT,
  ROUTE_WALLETS_TRADING
} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {Feature, FeatureFlag} from '../../utils/launchDarkly';

import './style.css';

export const Header: React.SFC<RootStoreProps> = ({rootStore}) => {
  const {authStore, profileStore, uiStore} = rootStore!;

  const headerLinkOptions = [
    {
      title: MenuItem.Trade,
      url: process.env.REACT_APP_TRADE_URL || 'http://trade.lykke.com'
    },
    {
      title: MenuItem.Funds,
      url: ROUTE_WALLETS_TRADING
    },
    {
      title: MenuItem.Settings,
      url: ROUTE_PROFILE
    }
  ];

  const secondMenuLinkOptions = [
    {
      title: MenuItem.LykkeStreams,
      url: 'https://streams.lykke.com/'
    },
    {
      title: MenuItem.ApiKeys,
      url: ROUTE_WALLETS_HFT
    },
    {
      title: MenuItem.FeesAndLimits,
      url: 'https://www.lykke.com/cp/wallet-fees-and-limits'
    }
  ];

  const renderLink = (classes: string, title: JSX.Element, url: string) => {
    const externalLinkRenderer = (
      <a href={url} className={classes}>
        {title}
      </a>
    );
    const internalLinkRenderer = (
      <Link to={url} className={classes}>
        {title}
      </Link>
    );

    return /^https?:\/\//.test(url)
      ? externalLinkRenderer
      : internalLinkRenderer;
  };

  const renderSubmenuItem = (route: string, title: string) => (
    <Route
      path={route}
      exact={true}
      // tslint:disable-next-line:jsx-no-lambda
      children={({match}) => (
        <div className="subheader__item">
          <Link to={route} className={classnames({active: !!match})}>
            {title}
          </Link>
        </div>
      )}
    />
  );

  return (
    <div>
      <LykkeHeader
        onLogout={authStore.signOut}
        userName={profileStore.fullName}
        email={profileStore.email}
        activeMenuItem={uiStore.activeHeaderMenuItem}
        headerLinkOptions={headerLinkOptions}
        renderLink={renderLink}
        isAuth={!!authStore.token}
        secondaryMenuLinkOptions={secondMenuLinkOptions}
        isSecondaryMenuShown={true}
      />
      <FeatureFlag
        flagKey={Feature.TwoFactorAuthentication}
        // tslint:disable-next-line:jsx-no-lambda
        renderFeatureCallback={() => (
          <div
            className={classnames('subheader', {
              hidden: uiStore.activeHeaderMenuItem !== MenuItem.Settings
            })}
          >
            {renderSubmenuItem(ROUTE_PROFILE, 'General')}
            {renderSubmenuItem(ROUTE_SECURITY, 'Security')}
          </div>
        )}
      />
    </div>
  );
};

export default inject(STORE_ROOT)(observer(Header));
