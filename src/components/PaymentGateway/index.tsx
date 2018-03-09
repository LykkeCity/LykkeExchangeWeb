import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {RootStoreProps} from '../../App';
import {
  ROUTE_DEPOSIT_CREDIT_CARD_FAIL,
  ROUTE_DEPOSIT_CREDIT_CARD_SUCCESS
} from '../../constants/routes';
import {STORE_ROOT} from '../../constants/stores';

import './style.css';

export interface PaymentGatewayProps
  extends RootStoreProps,
    RouteComponentProps<any> {}

export class PaymentGateway extends React.Component<PaymentGatewayProps> {
  readonly depositCreditCardStore = this.props.rootStore!
    .depositCreditCardStore;

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className="payment-gateway">
        <iframe
          onLoad={this.handleIframeLoaded}
          src={this.depositCreditCardStore.gatewayUrls.paymentUrl}
        />
      </div>
    );
  }

  private handleIframeLoaded = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    try {
      const currentUrl = e.currentTarget.contentWindow.location.href;

      if (currentUrl === this.depositCreditCardStore.gatewayUrls.okUrl) {
        this.props.history.replace(ROUTE_DEPOSIT_CREDIT_CARD_SUCCESS);
      }
      if (currentUrl === this.depositCreditCardStore.gatewayUrls.failUrl) {
        this.props.history.replace(ROUTE_DEPOSIT_CREDIT_CARD_FAIL);
      }
    } catch (err) {
      // Can't access iframe URL
    }
  };
}

export default inject(STORE_ROOT)(observer(PaymentGateway));
