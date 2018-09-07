import {Header as LykkeHeader} from '@lykkex/react-components';
import classnames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link, Route} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_PROFILE, ROUTE_SECURITY} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';

import './style.css';

export const Header: React.SFC<RootStoreProps> = ({rootStore}) => {
  const {authStore, profileStore, uiStore} = rootStore!;

  return (
    <div>
      <LykkeHeader
        onLogout={authStore.signOut}
        userName={profileStore.fullName}
        email={profileStore.email}
        activeMenuItem={uiStore.activeHeaderMenuItem}
        profileLink={`${process.env.REACT_APP_WEBWALLET_URL}/profile`}
      />
      <div
        className={classnames('subheader', {
          hidden: uiStore.activeHeaderMenuItem !== 'profile'
        })}
      >
        <Route
          path={ROUTE_PROFILE}
          exact={true}
          // tslint:disable-next-line:jsx-no-lambda
          children={({match}) => (
            <div className="subheader__item">
              <Link
                to={ROUTE_PROFILE}
                className={classnames({active: !!match})}
              >
                General
              </Link>
            </div>
          )}
        />
        <Route
          path={ROUTE_SECURITY}
          exact={true}
          // tslint:disable-next-line:jsx-no-lambda
          children={({match}) => (
            <div className="subheader__item">
              <Link
                to={ROUTE_SECURITY}
                className={classnames({active: !!match})}
              >
                Security
              </Link>
            </div>
          )}
        />
        {/* <div className="subheader__item"><Link to={ROUTE_PROFILE}>General</Link></div>
        <div className="subheader__item"><Link to={ROUTE_SECURITY}>Security</Link></div> */}
      </div>
    </div>
  );
};

export default inject(STORE_ROOT)(observer(Header));
