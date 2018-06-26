import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import {Link, RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import WalletTabs from '../../components/WalletTabs/index';
import {ROUTE_WALLETS_TRADING} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';

// tslint:disable-next-line:no-var-requires
const QRCode = require('qrcode.react');

import './style.css';

interface DepositCryptoPageProps
  extends RootStoreProps,
    RouteComponentProps<any> {}

export class DepositCryptoPage extends React.Component<DepositCryptoPageProps> {
  @observable showCopiedToClipboardMessage = false;

  readonly assetStore = this.props.rootStore!.assetStore;

  componentDidMount() {
    const {assetId} = this.props.match.params;
    this.assetStore.fetchAddress(assetId);

    window.scrollTo(0, 0);
  }

  render() {
    const {assetId} = this.props.match.params;
    const asset = this.assetStore.getById(assetId);

    return (
      <div className="container">
        <WalletTabs activeTabRoute={ROUTE_WALLETS_TRADING} />
        {asset && (
          <div className="deposit-crypto">
            <div className="deposit-crypto__title">Deposit {asset.name}</div>
            <div className="deposit-crypto__subtitle">Blockchain transfer</div>
            <div className="deposit-crypto__description">
              To deposit {asset.name} to your trading wallet please use the
              following bank account details.
            </div>
            {asset.address && (
              <div className="deposit-crypto__address-qr">
                <QRCode size="240" value={asset.address} />
              </div>
            )}
            <div className="deposit-crypto__address-info">
              <div>
                <div className="deposit-crypto__address-label">
                  Your wallet address
                </div>
                <div className="deposit-crypto__address">{asset.address}</div>
              </div>
              <div>
                <CopyToClipboard
                  text={asset.address}
                  onCopy={this.handleCopyAddress}
                >
                  <button className="btn btn--icon" type="button">
                    <i className="icon icon--copy_thin" />
                  </button>
                </CopyToClipboard>
                {this.showCopiedToClipboardMessage && (
                  <small className="copy-to-clipboard-message">Copied!</small>
                )}
              </div>
            </div>
            <div className="go-back-btn">
              <Link to={ROUTE_WALLETS_TRADING} className="btn btn--flat">
                Go back
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  private readonly handleCopyAddress = (text: string) => {
    if (!!text) {
      this.showCopiedToClipboardMessage = true;
      setTimeout(() => {
        this.showCopiedToClipboardMessage = false;
      }, 2000);
    }
  };
}

export default inject(STORE_ROOT)(observer(DepositCryptoPage));
