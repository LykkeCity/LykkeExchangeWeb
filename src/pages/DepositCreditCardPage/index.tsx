import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {APPSTORE_LINK, GOOGLEPLAY_LINK} from '../../components/Apps';
import {Banner} from '../../components/Banner';
import DepositCreditCardForm from '../../components/DepositCreditCardForm';
import {ROUTE_DEPOSIT_CREDIT_CARD_GATEWAY} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';
import {GatewayUrls} from '../../models';

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
  readonly depositCreditCardStore = this.props.rootStore!
    .depositCreditCardStore;
  readonly uiStore = this.props.rootStore!.uiStore;
  readonly localizationStore = this.props.rootStore!.localizationStore;

  componentDidMount() {
    const {walletId, assetId} = this.props.match.params;
    const {baseAsset} = this.profileStore;
    const wallet = this.walletStore.findWalletById(walletId);
    const asset = this.assetStore.getById(assetId || baseAsset);

    if (!!asset) {
      this.depositCreditCardStore.newDeposit.setAsset(asset);
    }
    if (!!wallet) {
      this.depositCreditCardStore.newDeposit.setWallet(wallet);
    }

    this.uiStore.showDisclaimerError = false;
    window.scrollTo(0, 0);
  }

  render() {
    const asset = this.depositCreditCardStore.newDeposit.asset;
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
    const labels = this.localizationStore.i18nDepositCreditCardPage;

    return (
      <div className="container">
        <div className="deposit-credit-card">
          <Banner
            show={this.uiStore.showDisclaimerError}
            warning
            className="disclaimer-banner"
            title={labels.DisclaimerErrorTitle}
            text={labels.DisclaimerErrorText}
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
                  {labels.IOSDownload}
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
                  {labels.AndroidDownload}
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
            {labels.Deposit} {!!asset && asset!.name}
          </div>
          <div className="deposit-credit-card__subtitle">
            {labels.CreditCard}
          </div>
          <div className="deposit-credit-card__description">
            {labels.FormDescription1} {!!asset && asset!.name}{' '}
            {labels.FormDescription2}
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

  private handleDisclaimerError = () => {
    this.uiStore.showDisclaimerError = true;
    window.scrollTo(0, 0);
  };

  private handleSubmitSuccess = (gatewayUrls: GatewayUrls) => {
    this.depositCreditCardStore.setGatewayUrls(gatewayUrls);
    this.props.history.replace(ROUTE_DEPOSIT_CREDIT_CARD_GATEWAY);
  };
}

export default inject(STORE_ROOT)(observer(DepositCreditCardPage));
