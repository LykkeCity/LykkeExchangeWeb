import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import {RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import ClientDialog from '../../components/ClientDialog';
import Spinner from '../../components/Spinner';
import WalletTabs from '../../components/WalletTabs/index';
import {AnalyticsEvent, Place} from '../../constants/analyticsEvents';
import {ROUTE_WALLETS_TRADING} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {DialogModel} from '../../models';
import {DialogConditionType} from '../../models/dialogModel';

// tslint:disable-next-line:no-var-requires
const QRCode = require('qrcode.react');

import './style.css';

interface DepositCryptoPageProps
  extends RootStoreProps,
    RouteComponentProps<any> {}

export class DepositCryptoPage extends React.Component<DepositCryptoPageProps> {
  @observable copiedToClipboardText = '';
  @observable addressLoaded = false;

  readonly assetStore = this.props.rootStore!.assetStore;
  readonly dialogStore = this.props.rootStore!.dialogStore;
  readonly uiStore = this.props.rootStore!.uiStore;
  readonly analyticsService = this.props.rootStore!.analyticsService;

  componentDidMount() {
    const {assetId} = this.props.match.params;

    const clientDialog = this.dialogStore.pendingDialogs.find(
      (dialog: DialogModel) =>
        dialog.conditionType === DialogConditionType.Predeposit
    );
    if (clientDialog) {
      clientDialog.visible = true;
    }
    this.assetStore.fetchAddress(assetId).finally(() => {
      this.addressLoaded = true;
    });

    window.scrollTo(0, 0);
  }

  render() {
    const {assetId} = this.props.match.params;
    const asset = this.assetStore.getById(assetId);
    const clientDialog = this.dialogStore.pendingDialogs.find(
      (dialog: DialogModel) =>
        dialog.conditionType === DialogConditionType.Predeposit
    );
    const defaultWarningMessage = (assetName: string) =>
      `Please, only send ${assetName} to this address. Depositing any other asset may result in funds loss.`;
    const warningMessages = {
      BTC:
        'Please, only send Bitcoin (BTC) to this address. Depositing any other asset may result in funds loss.',
      ETC:
        'Please, only send Ethereum Classic (ETC) to this address, do not send ETH. Depositing any asset other than ETC may result in funds loss.',
      ETH:
        'Please, only send Ethereum (ETH) to this address, do not send ETC or ERC20 tokens. Depositing any asset other than ETH may result in funds loss.'
    };

    return (
      <div className="container">
        {clientDialog && (
          <ClientDialog
            dialog={clientDialog}
            onDialogCancel={this.handleDialogCancel}
            onDialogConfirm={this.handleDialogConfirm}
          />
        )}
        <WalletTabs activeTabRoute={ROUTE_WALLETS_TRADING} />
        <a
          href="#"
          // tslint:disable-next-line:jsx-no-lambda
          onClick={(e: any) => this.handleGoBack(e, 'arrow')}
          className="arrow-back"
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/back-icn.svg`}
            alt="Back"
          />
        </a>
        {asset && (
          <div className="deposit-crypto">
            <div className="deposit-crypto__title">Deposit {asset.name}</div>
            <div className="deposit-crypto__subtitle">Blockchain transfer</div>
            {asset.addressBase && asset.addressExtension ? (
              <div>
                <div className="deposit-crypto__description">
                  To deposit {asset.name} to your trading wallet please use the
                  following address and deposit tag or scan the QR codes.
                </div>
                {this.renderAddressBlock(
                  asset.addressBase,
                  'Your wallet address'
                )}
                {this.renderAddressBlock(asset.addressExtension, 'Deposit tag')}
              </div>
            ) : asset.address ? (
              <div>
                <div className="deposit-crypto__description">
                  To deposit {asset.name} to your trading wallet please use the
                  following address.
                </div>
                {this.renderAddressBlock(asset.address, 'Your wallet address')}
              </div>
            ) : this.addressLoaded ? (
              <div className="deposit-crypto__description text-center">
                Not available
              </div>
            ) : (
              <Spinner />
            )}
            <div className="deposit-crypto__actions">
              <div className="deposit-crypto__warning">
                {warningMessages[asset.name] ||
                  defaultWarningMessage(asset.name)}
              </div>
              {(asset.addressBase || asset.address) && (
                <div>
                  <CopyToClipboard
                    text={asset.addressBase || asset.address}
                    onCopy={this.handleCopyAddress}
                  >
                    {this.copiedToClipboardText ===
                    (asset.addressBase || asset.address) ? (
                      <button className="btn btn--primary disabled">
                        Copied to clipboard
                      </button>
                    ) : (
                      <button className="btn btn--primary">Copy address</button>
                    )}
                  </CopyToClipboard>
                </div>
              )}
              <a
                href="#"
                // tslint:disable-next-line:jsx-no-lambda
                onClick={(e: any) => this.handleGoBack(e, 'button')}
                className="btn btn--flat"
              >
                Go back
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }

  private handleGoBack = (e: any, source: string) => {
    e.preventDefault();
    this.analyticsService.track(
      AnalyticsEvent.GoBack(Place.DepositCryptoPage, source)
    );

    this.props.history.goBack();
  };

  private renderAddressBlock = (address: string, label: string) => {
    const QR_SIZE = 240;

    return (
      <div>
        <div className="deposit-crypto__address-qr">
          <CopyToClipboard text={address} onCopy={this.handleCopyAddress}>
            <QRCode size={QR_SIZE} value={address} />
          </CopyToClipboard>
          {this.copiedToClipboardText === address && (
            <small className="copy-to-clipboard-message">
              Copied to clipboard
            </small>
          )}
        </div>
        <div className="deposit-crypto__address-info">
          <div>
            <div className="deposit-crypto__address-label">{label}</div>
            <div className="deposit-crypto__address">{address}</div>
          </div>
          <div>
            <CopyToClipboard text={address} onCopy={this.handleCopyAddress}>
              <button className="btn btn--icon" type="button">
                <i className="icon icon--copy_thin" />
              </button>
            </CopyToClipboard>
          </div>
        </div>
      </div>
    );
  };

  private readonly handleCopyAddress = (text: string) => {
    const HELPER_TEXT_TIMEOUT = 2000;
    this.copiedToClipboardText = text;
    setTimeout(() => {
      this.copiedToClipboardText = '';
    }, HELPER_TEXT_TIMEOUT);

    const {assetId} = this.props.match.params;
    this.analyticsService.track(
      AnalyticsEvent.FinishDeposit(
        Place.DepositCryptoPage,
        'Blockchain Transfer',
        assetId
      )
    );
  };

  private handleDialogConfirm = async (dialog: DialogModel) => {
    if (!dialog.isConfirmed) {
      return;
    }

    const {assetId} = this.props.match.params;
    try {
      await this.dialogStore.submit(dialog);
    } finally {
      this.dialogStore.removeDialog(dialog);
      this.addressLoaded = false;
      await this.assetStore.fetchAddress(assetId);
    }
  };

  private handleDialogCancel = async (dialog: DialogModel) => {
    this.dialogStore.removeDialog(dialog);
  };
}

export default inject(STORE_ROOT)(observer(DepositCryptoPage));
