import {Dialog} from '@lykkecity/react-components';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import DepositCreditCardForm from '../../components/DepositCreditCardForm';
import {AnalyticsEvent, Place} from '../../constants/analyticsEvents';
import {
  ROUTE_DEPOSIT_CREDIT_CARD_GATEWAY,
  ROUTE_VERIFICATION
} from '../../constants/routes';
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
  readonly depositStore = this.props.rootStore!.depositStore;
  readonly uiStore = this.props.rootStore!.uiStore;
  readonly dialogStore = this.props.rootStore!.dialogStore;
  readonly analyticsService = this.props.rootStore!.analyticsService;

  private showDislaimer = false;

  componentDidMount() {
    const {walletId, assetId} = this.props.match.params;
    const {baseAsset} = this.profileStore;
    const wallet = this.walletStore.findWalletById(walletId);
    const asset = this.assetStore.getById(assetId || baseAsset);

    this.depositStore.fetchFee();
    this.depositStore.fetchDepositDefaultValues().then(_ => {
      if (!!asset) {
        this.depositStore.newDeposit.setAsset(asset);
      }
      if (!!wallet) {
        this.depositStore.newDeposit.setWallet(wallet);
      }
      window.scrollTo(0, 0);
    });
  }

  componentWillUnmount() {
    this.showDislaimer = false;
  }

  render() {
    const asset = this.depositStore.newDeposit.asset;
    const cardIcons = ['icon-card-1.png', 'icon-card-5.png', 'icon-card-6.png'];

    const assetDisclaimer = this.dialogStore.assetDisclaimers[0];
    const showMaxDepositErrorDialog = this.depositStore
      .showMaxDepositErrorDialog;
    const fetchBankCardPaymentUrlError = this.depositStore
      .fetchBankCardPaymentUrlError;
    return (
      <div className="container">
        <div className="deposit-credit-card">
          {assetDisclaimer && (
            <Dialog
              visible={assetDisclaimer.visible}
              title={assetDisclaimer.header}
              onCancel={this.handleDisclaimerCancel}
              cancelButton={{text: 'Cancel'}}
              onConfirm={this.handleDisclaimerConfirm}
              confirmButton={{text: 'I accept'}}
              shouldAccept
              hasScroll
              description={this.renderDisclaimerDescription(
                assetDisclaimer.text
              )}
            />
          )}
          <Dialog
            visible={showMaxDepositErrorDialog}
            title="Oops.."
            onCancel={this.handleMaxDepositErrorCancel}
            cancelButton={{text: 'Later'}}
            onConfirm={this.handleMaxDepositErrorConfirm}
            confirmButton={{text: 'Upgrade'}}
            description={
              fetchBankCardPaymentUrlError
                ? fetchBankCardPaymentUrlError.message
                : ''
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
            To deposit {!!asset && asset!.name} to your Portfolio please fill in
            the form.
          </div>
          <DepositCreditCardForm
            onDisclaimerError={this.handleDisclaimerError}
            onMaxDepositError={this.onMaxDepositError}
            onSuccess={this.handleSubmitSuccess}
            onSubmitForm={this.handleFormSubmit}
            asset={asset}
            handleViewTermsOfUse={this.trackViewTermsOfUse}
            handleGoBack={this.trackGoBack}
          />
        </div>
      </div>
    );
  }

  private trackViewTermsOfUse = () => {
    this.analyticsService.track(
      AnalyticsEvent.ViewTermsOfUse(Place.DepositCreditCardPage)
    );
  };

  private trackGoBack = (source: string) => {
    this.analyticsService.track(
      AnalyticsEvent.GoBack(Place.DepositCreditCardPage, source)
    );
  };

  private renderDisclaimerDescription = (text: string) => (
    <span dangerouslySetInnerHTML={{__html: text}} />
  );

  private handleDisclaimerConfirm = async () => {
    await this.dialogStore.approveAssetDisclaimer(
      this.dialogStore.assetDisclaimers[0]
    );
    if (this.depositStore.submitDeposit) {
      this.depositStore.submitDeposit();
    }
  };

  private handleDisclaimerCancel = async () => {
    this.dialogStore.declineAssetDisclaimer(
      this.dialogStore.assetDisclaimers[0]
    );
  };

  private handleFormSubmit = (submitForm: () => void) => {
    this.showDislaimer = true;
    this.depositStore.submitDeposit = submitForm;
  };

  private handleDisclaimerError = async () => {
    await this.dialogStore.fetchAssetDisclaimers();
    if (this.showDislaimer) {
      this.dialogStore.assetDisclaimers[0].visible = true;
    }
  };

  private onMaxDepositError = (message: string) => {
    this.depositStore.setShowMaxDepositErrorDialog(true);
  };

  private handleMaxDepositErrorCancel = () => {
    this.depositStore.setShowMaxDepositErrorDialog(false);
    this.analyticsService.track(AnalyticsEvent.DepositLimitValidation('later'));
  };

  private handleMaxDepositErrorConfirm = () => {
    this.depositStore.setShowMaxDepositErrorDialog(false);
    this.props.history.push(ROUTE_VERIFICATION);
    this.analyticsService.track(
      AnalyticsEvent.DepositLimitValidation('upgrade')
    );
  };

  private handleSubmitSuccess = (gatewayUrls: GatewayUrls) => {
    const {assetId} = this.props.match.params;

    this.analyticsService.track(
      AnalyticsEvent.ProceedToPaymentProvider(assetId)
    );

    this.depositStore.setGatewayUrls(gatewayUrls);
    this.props.history.push(ROUTE_DEPOSIT_CREDIT_CARD_GATEWAY);
  };
}

export default inject(STORE_ROOT)(observer(DepositCreditCardPage));
