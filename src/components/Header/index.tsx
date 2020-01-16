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

import './style.css';

const LYKKE_STREAMS_ROUTE = 'https://streams.lykke.com/';
const FEES_AND_LIMITS_ROUTE = 'https://www.lykke.com/cp/wallet-fees-and-limits';

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
      title: MenuItem.Profile,
      url: ROUTE_PROFILE
    }
  ];

  const secondMenuLinkOptions = [
    {
      title: MenuItem.LykkeStreams,
      url: LYKKE_STREAMS_ROUTE
    },
    {
      title: MenuItem.ApiKeys,
      url: ROUTE_WALLETS_HFT
    },
    {
      title: MenuItem.FeesAndLimits,
      url: FEES_AND_LIMITS_ROUTE
    }
  ];

  const renderLink = (classes: string, title: JSX.Element, url: string) => {
    const isBlank =
      [LYKKE_STREAMS_ROUTE, FEES_AND_LIMITS_ROUTE].indexOf(url) !== -1;

    const externalLinkRenderer = (
      <a href={url} className={classes} target={isBlank ? '_blank' : undefined}>
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
      {!uiStore.hasPendingRequests && (
        <div
          className={classnames('subheader', {
            hidden: uiStore.activeHeaderMenuItem !== MenuItem.Profile
          })}
        >
          {renderSubmenuItem(ROUTE_PROFILE, 'General')}
          {renderSubmenuItem(ROUTE_SECURITY, 'Security')}
        </div>
      )}
    </div>
  );
};

export default inject(STORE_ROOT)(observer(Header));
