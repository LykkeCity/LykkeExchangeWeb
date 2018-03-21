import * as classNames from 'classnames';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import {Link} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {
  ROUTE_DEPOSIT_CREDIT_CARD_TO,
  ROUTE_TRANSFER_FROM,
  ROUTE_TRANSFER_TO
} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {WalletModel} from '../../models';
import {
  Dropdown,
  DropdownContainer,
  DropdownControl,
  DropdownList,
  DropdownListItem,
  DropdownPosition
} from '../Dropdown';
import './style.css';

interface WalletActionBarProps extends RootStoreProps {
  wallet: WalletModel;
}

export class WalletActionBar extends React.Component<WalletActionBarProps> {
  state = {message: ''};

  render() {
    const {wallet, rootStore} = this.props;
    const assets = rootStore!.assetStore.assets.filter(
      a => a.isBankDepositEnabled
    );

    return (
      <div className="wallet-action-bar">
        <div className="wallet-action-bar__item">
          {wallet.isTrading ? (
            <Dropdown>
              <DropdownControl>
                <a>Deposit</a>
              </DropdownControl>
              <DropdownContainer>
                <DropdownList className="wallet-menu">
                  <DropdownListItem>
                    <Dropdown position={DropdownPosition.RIGHT}>
                      <DropdownControl>
                        <a>
                          <img
                            className="icon"
                            src={`${process.env
                              .PUBLIC_URL}/images/paymentMethods/deposit-credit-card.svg`}
                          />
                          Credit Card
                        </a>
                      </DropdownControl>
                      <DropdownContainer>
                        <DropdownList className="wallet-asset-menu">
                          {assets.map(a => (
                            <DropdownListItem key={a.id}>
                              <Link
                                to={ROUTE_DEPOSIT_CREDIT_CARD_TO(
                                  wallet.id,
                                  a.id
                                )}
                              >
                                {a.name}
                              </Link>
                            </DropdownListItem>
                          ))}
                        </DropdownList>
                      </DropdownContainer>
                    </Dropdown>
                  </DropdownListItem>
                </DropdownList>
              </DropdownContainer>
            </Dropdown>
          ) : (
            <div className="wallet-action-bar__item">
              <Link to={ROUTE_TRANSFER_TO(wallet.id)}>Deposit</Link>
            </div>
          )}
        </div>
        <div className="wallet-action-bar__item">
          <Link to={ROUTE_TRANSFER_FROM(wallet.id)}>Withdraw</Link>
        </div>
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
