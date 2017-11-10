import * as classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link, Route, withRouter} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_WALLETS_HFT, ROUTE_WALLETS_PRIVATE} from '../../constants/routes';
import './style.css';

interface TabLinkProps {
  label: string;
  to: string;
}

const TabLink: React.SFC<TabLinkProps> = ({label, to}) => (
  <Route
    path={to}
    exact={true}
    // tslint:disable-next-line:jsx-no-lambda
    children={({match}) => (
      <div className={classNames('tab', {'tab--active': !!match})}>
        <Link to={to} className="tab__link">
          {label}
        </Link>
      </div>
    )}
  />
);

export const WalletTabs = (props: any) => (
  <div className="wallet-tabs">
    <div className="tabs">
      <TabLink label="Trading" to={ROUTE_WALLETS_PRIVATE} />
      <TabLink label="API Wallets" to={ROUTE_WALLETS_HFT} />
    </div>
    <Route
      path={ROUTE_WALLETS_HFT}
      exact={true}
      // tslint:disable-next-line:jsx-no-lambda
      render={({match}) => (
        <div className="tab__pane row">
          <div className="col-sm-8">
            Cross functional teams enable out of the box brainstorming. Overcome
            key issues to meet key milestones closing these latest prospects is
            like putting socks on an octopus, and highlights. Put a record on
            and see who dances at the end of the day.
          </div>
          <div className="col-sm-4">
            <button
              className="btn btn--primary btn-sm"
              onClick={props.onCreateNewWallet}
            >
              <i className="icon icon--add" /> New Wallet
            </button>
          </div>
        </div>
      )}
    />
  </div>
);

export default withRouter(
  inject(({rootStore}: RootStoreProps) => ({
    onCreateNewWallet: rootStore!.uiStore.toggleCreateWalletDrawer
  }))(observer(WalletTabs))
);
