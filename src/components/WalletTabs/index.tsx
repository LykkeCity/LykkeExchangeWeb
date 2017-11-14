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
          Trading wallet is driven by LykkeWallet app. You can confirm a Trading
          Wallet transaction only by signing it on your mobile device. Trading
          Wallet is secured with 2-of-2 multisignature protection. One key is
          controlled by Lykke and another one is located on your mobile device.
          Please keep your 12 words seed private key backup safely.
        </div>
      </div>
    </TabPane>
    <TabPane to={ROUTE_WALLETS_HFT}>
      <div className="tab__pane row">
        <div className="col-sm-8">
          API Wallet offers you a faster trading interface. You can have
          multiple API wallets. Funds deposited to API wallet are under Lykke
          custodian. The API is secured with an API Key. Please keep the key
          safe. To withdraw the funds from your API wallet you need to transfer
          them to your Trading Wallet first.
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
