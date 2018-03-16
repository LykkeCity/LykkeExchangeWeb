import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import DepositCreditCardForm from '../../components/DepositCreditCardForm';
import {ROUTE_DEPOSIT_CREDIT_CARD_GATEWAY} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';

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

    return (
      <div className="container">
        <div className="deposit-credit-card">
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
            onSuccess={this.handleSubmitSuccess}
            asset={asset}
          />
        </div>
      </div>
    );
  }

  private handleSubmitSuccess = (
    failUrl: string,
    okUrl: string,
    paymentUrl: string
  ) => {
    this.depositCreditCardStore.setGatewayUrls(failUrl, okUrl, paymentUrl);
    this.props.history.replace(ROUTE_DEPOSIT_CREDIT_CARD_GATEWAY);
  };
}

export default inject(STORE_ROOT)(observer(DepositCreditCardPage));
