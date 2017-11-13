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

interface TabPaneProps {
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

const TabPane: React.SFC<TabPaneProps> = ({to, children}) => (
  <Route
    path={to}
    exact={true}
    // tslint:disable-next-line:jsx-no-lambda
    render={({match}) => children}
  />
);

export const WalletTabs = (props: any) => (
  <div className="wallet-tabs">
    <div className="tabs">
      <TabLink label="Trading" to={ROUTE_WALLETS_PRIVATE} />
      <TabLink label="API Wallets" to={ROUTE_WALLETS_HFT} />
    </div>
    <TabPane to={ROUTE_WALLETS_PRIVATE}>
      <div className="tab__pane row">
        <div className="col-sm-12" style={{textAlign: 'left'}}>
          Trading wallet is driven by LykkeWallet app. You can not make any
          transactions with your Trading Wallet without having signature on your
          mobile device. Trading Wallet is secured with 2-of-2 multisignature
          protection. One key is controled by Lykke and another one is located
          on your mobile device. Please keep your 12 words seed private key
          backup safly.
        </div>
      </div>
    </TabPane>
    <TabPane to={ROUTE_WALLETS_HFT}>
      <div className="tab__pane row">
        <div className="col-sm-8">
          API Wallet allows you to have the fastest interface for trading. You
          may have multiple API wallets. Funds deposited into API wallet are
          under Lykke custodian. API is secured with API Key. Please keep it
          safe. To be able to withdraw funds it must be transfered into Trading
          Wallet first.
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
    </TabPane>
  </div>
);

export default withRouter(
  inject(({rootStore}: RootStoreProps) => ({
    onCreateNewWallet: rootStore!.uiStore.toggleCreateWalletDrawer
  }))(observer(WalletTabs))
);
