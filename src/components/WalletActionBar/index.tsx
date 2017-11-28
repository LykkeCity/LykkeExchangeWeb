import * as classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import {RootStoreProps} from '../../App';
import {ROUTE_TRANSFER_FROM, ROUTE_TRANSFER_TO} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models';
import {NavLink} from '../Header/navbar';
import './style.css';

interface WalletActionBarProps extends RootStoreProps {
  wallet: WalletModel;
}

export class WalletActionBar extends React.Component<WalletActionBarProps> {
  state = {message: ''};

  render() {
    const {wallet} = this.props;
    return (
      <div className="wallet-action-bar">
        <ul>
          <NavLink
            to={ROUTE_TRANSFER_TO(wallet.id)}
            label="Deposit"
            className="wallet-action-bar__item"
          />
          <NavLink
            to={ROUTE_TRANSFER_FROM(wallet.id)}
            label="Withdraw"
            className="wallet-action-bar__item"
          />
        </ul>
        {wallet.apiKey && (
          <div
            className={classNames(
              'wallet-action-bar__item',
              'wallet-action-bar__item--key',
              'pull-right'
            )}
          >
            {!!this.state.message && (
              <small
                style={{
                  color: 'green',
                  fontWeight: 'normal',
                  paddingRight: '1em'
                }}
              >
                {this.state.message}
              </small>
            )}
            <CopyToClipboard
              text={this.props.wallet.apiKey}
              onCopy={this.handleCopyApiKey}
            >
              <a title="Click to copy your API Key">API Key</a>
            </CopyToClipboard>
          </div>
        )}
      </div>
    );
  }

  private handleCopyApiKey = (text: string) => {
    if (!!text) {
      this.setState({message: 'Copied!'});
      setTimeout(() => {
        this.setState({message: ''});
      }, 2000);
    }
  };
}

export default inject(STORE_ROOT)(observer(WalletActionBar));
