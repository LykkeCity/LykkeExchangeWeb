import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {ROUTE_MANAGE_WHITELISTED_ADDRESSES} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';

class HftContent extends React.Component<RootStoreProps> {
  private readonly uiStore = this.props.rootStore!.uiStore;

  componentWillMount() {
    this.uiStore.activeHeaderMenuItem = '';
  }

  render() {
    return (
      <div className="tab__pane">
        <div className="row">
          <div className="col-sm-8">
            <p className="hint text-left">
              API Wallet offers you a faster trading interface. You can have
              multiple API wallets. Funds deposited to API wallet are under
              Lykke custodian. The API is secured with an API Key. Please keep
              the key safe. To withdraw the funds from your API wallet you need
              to transfer them to your Trading Wallet first.
            </p>
            <p style={{marginTop: '10px'}} className="hint text-left">
              Read more about using API here&nbsp;<a
                className="link"
                href="https://support.lykke.com/hc/en-us/articles/360019901919-API-Documentation"
                target="_blank"
              >
                {
                  'https://support.lykke.com/hc/en-us/articles/360019901919-API-Documentation'
                }
              </a>
            </p>
          </div>
          <div className="col-sm-4 text-right">
            <button
              className="btn btn--primary btn-sm btn-block"
              onClick={this.uiStore.toggleWalletDrawer}
            >
              <i className="icon icon--add" /> New Wallet
            </button>
            <Link
              to={ROUTE_MANAGE_WHITELISTED_ADDRESSES}
              className="text--truncate btn btn--primary btn-sm btn-block"
            >
              Manage Whitelisted Addresses
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(HftContent));
