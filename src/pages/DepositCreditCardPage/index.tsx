import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {APPSTORE_LINK, GOOGLEPLAY_LINK} from '../../components/Apps';
import {Banner} from '../../components/Banner';
import ClientDialog from '../../components/ClientDialog';
import DepositCreditCardForm from '../../components/DepositCreditCardForm';
import {ROUTE_DEPOSIT_CREDIT_CARD_GATEWAY} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {DialogModel, GatewayUrls} from '../../models';
import {DialogConditionType} from '../../models/dialogModel';

import './style.css';

interface DepositCreditCardPageProps
  extends RootStoreProps,
    RouteComponentProps<any> {}

export class DepositCreditCardPage extends React.Component<
  DepositCreditCardPageProps
> {
  readonly walletStore = this.props.rootStore!.walletStore;
  readonly assetStore = this.props.rootStore!.assetStore;
  readonly profileStore = this.props.rootStore!.profileStore;
  readonly depositStore = this.props.rootStore!.depositStore;
  readonly uiStore = this.props.rootStore!.uiStore;
  readonly dialogStore = this.props.rootStore!.dialogStore;

  componentDidMount() {
    const {walletId, assetId} = this.props.match.params;
    const {baseAsset} = this.profileStore;
    const wallet = this.walletStore.findWalletById(walletId);
    const asset = this.assetStore.getById(assetId || baseAsset);

    if (!!asset) {
      this.depositStore.newDeposit.setAsset(asset);
    }
    if (!!wallet) {
      this.depositStore.newDeposit.setWallet(wallet);
    }

    const clientDialog = this.dialogStore.pendingDialogs.find(
      (dialog: DialogModel) =>
        dialog.conditionType === DialogConditionType.Predeposit
    );
    if (clientDialog) {
      clientDialog.visible = true;
    }

    this.uiStore.showDisclaimerError = false;
    window.scrollTo(0, 0);
  }

  render() {
    const asset = this.depositStore.newDeposit.asset;
    const cardIcons = [
      'visa.svg',
      'visa-electron.svg',
      'mc.png',
      'maestro.svg',
      'americanexpress.svg',
      'jcb.svg',
      'unionpay.svg',
      'skrill.svg',
      'przelewy.png',
      'poli.png',
      'ideal.png',
      'giropay.svg'
    ];
    const clientDialog = this.dialogStore.pendingDialogs.find(
      (dialog: DialogModel) =>
        dialog.conditionType === DialogConditionType.Predeposit
    );

    return (
      <div className="container">
        <div className="deposit-credit-card">
          {clientDialog && (
            <ClientDialog
              dialog={clientDialog}
              onDialogConfirm={this.handleDialogConfirm}
              onDialogCancel={this.handleDialogCancel}
            />
          )}
          <Banner
            show={this.uiStore.showDisclaimerError}
            warning
            className="disclaimer-banner"
            title="Pending disclaimer"
            text="You need to accept pending disclaimer with your Lykke Wallet mobile app."
            footer={
              <div>
                <a
                  href={APPSTORE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="app-link"
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/images/apple-icn.svg`}
                    alt="App Store"
                  />
                  Download for iOS
                </a>
                <a
                  href={GOOGLEPLAY_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="app-link"
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/images/google-play-icn.svg`}
                    alt="Google Play"
                  />
                  Download for Android
                </a>
              </div>
            }
          />
          <ul className="deposit-credit-card__icons">
            {cardIcons.map(cardIcon => (
              <li key={cardIcon}>
                <img
                  src={`${process.env
                    .PUBLIC_URL}/images/paymentMethods/${cardIcon}`}
                />
              </li>
            ))}
          </ul>
          <div className="deposit-credit-card__title">
            Deposit {!!asset && asset!.name}
          </div>
          <div className="deposit-credit-card__subtitle">Credit Card</div>
          <div className="deposit-credit-card__description">
            To deposit {!!asset && asset!.name} to your trading wallet please
            fill in the form.
          </div>
          <DepositCreditCardForm
            onDisclaimerError={this.handleDisclaimerError}
            onSuccess={this.handleSubmitSuccess}
            asset={asset}
          />
        </div>
      </div>
    );
  }

  private handleDialogConfirm = (dialog: DialogModel) => {
    if (dialog.isConfirmed) {
      this.dialogStore.submit(dialog);
      this.dialogStore.pendingDialogs = this.dialogStore.pendingDialogs.filter(
        (d: DialogModel) => dialog.id !== d.id
      );
    }
  };

  private handleDialogCancel = async (dialog: DialogModel) => {
    this.dialogStore.pendingDialogs = this.dialogStore.pendingDialogs.filter(
      (d: DialogModel) => dialog.id !== d.id
    );
  };

  private handleDisclaimerError = () => {
    this.uiStore.showDisclaimerError = true;
    window.scrollTo(0, 0);
  };

  private handleSubmitSuccess = (gatewayUrls: GatewayUrls) => {
    this.depositStore.setGatewayUrls(gatewayUrls);
    this.props.history.replace(ROUTE_DEPOSIT_CREDIT_CARD_GATEWAY);
  };
}

export default inject(STORE_ROOT)(observer(DepositCreditCardPage));
