import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RootStoreProps} from '../../App';
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
                href="https://www.lykke.com/cp/lykke-trading-api"
                target="_blank"
              >
                {'https://www.lykke.com/cp/lykke-trading-api'}
              </a>
            </p>
          </div>
          <div className="col-sm-4 text-right">
            <button
              className="btn btn--primary btn-sm"
              onClick={this.uiStore.toggleWalletDrawer}
            >
              <i className="icon icon--add" /> New Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default inject(STORE_ROOT)(observer(HftContent));
